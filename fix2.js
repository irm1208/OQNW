const fs = require("fs");
const path = require("path");

const dir = "artifacts/admin-panel/src/pages";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));

function removeHiddenClasses(str) {
  return str.replace(/\b(hidden|sm:table-cell|md:table-cell|lg:table-cell|sm:hidden|md:hidden|lg:hidden)\b/g, "").replace(/\s{2,}/g, " ");
}

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");
  
  if (!content.includes("TableBody") && !content.includes("<tbody")) continue;

  // Let's replace classes in TableHead, TableCell, th, td
  // We'll just do a global replace for those specific tags
  const tagRegex = /(<(?:TableHead|TableCell|th|td)\b)([^>]*)(>)/g;
  content = content.replace(tagRegex, (match, open, attrs, close) => {
    // skip if we are inside a tag that just has => like arrow functions (rare in opening tag, but possible)
    let newAttrs = attrs;
    if (newAttrs.includes("className=")) {
      newAttrs = newAttrs.replace(/className=(["'])(.*?)\1/g, (m, quote, cls) => {
        return `className=${quote}${removeHiddenClasses(cls).trim()}${quote}`;
      });
      // also handle curly braces className={"..."}
      newAttrs = newAttrs.replace(/className=\{([^}]+)\}/g, (m, cls) => {
        return `className={${removeHiddenClasses(cls).trim()}}`;
      });
    }
    return `${open}${newAttrs}${close}`;
  });

  // Now process data-labels
  // For each table...
  const tableRegex = /<(?:Table|table)[^>]*>[\s\S]*?<\/(?:Table|table)>/g;
  content = content.replace(tableRegex, (tableHtml) => {
    // 1. extract headers from thead/TableHeader
    const headGroupRegex = /<(?:TableHeader|thead)[^>]*>([\s\S]*?)<\/(?:TableHeader|thead)>/;
    const headMatch = headGroupRegex.exec(tableHtml);
    if (!headMatch) return tableHtml;
    
    const headers = [];
    const headCellRegex = /<(?:TableHead|th)[^>]*>(.*?)<\/(?:TableHead|th)>/gs;
    let m;
    while ((m = headCellRegex.exec(headMatch[1])) !== null) {
      let inner = m[1];
      let text = inner.replace(/<[^>]+>/g, "").trim();
      
      // Heuristics for empty headers (often Checkboxes or Actions)
      if (text === "") {
        if (inner.includes("Checkbox") || inner.includes("type=\"checkbox\"")) {
          text = "Select";
        } else if (inner.includes("Action") || m[0].includes("w-[44px]") || m[0].includes("w-[80px]")) {
          text = "Actions";
        }
      }
      headers.push(text);
    }
    
    // 2. inject data-label into tbody/TableBody cells
    const bodyRegex = /(<(?:TableBody|tbody)[^>]*>)([\s\S]*?)(<\/(?:TableBody|tbody)>)/g;
    return tableHtml.replace(bodyRegex, (match, open, bodyContent, close) => {
      
      const rowRegex = /(<(?:TableRow|tr)[^>]*>)([\s\S]*?)(<\/(?:TableRow|tr)>)/g;
      const newBody = bodyContent.replace(rowRegex, (rMatch, rOpen, rContent, rClose) => {
        let cellIdx = 0;
        
        // We iterate char by char to find `<TableCell` or `<td` and its matching `>`
        // This is safe against nested `<` and `>` inside `{}`
        let i = 0;
        let newRContent = "";
        while (i < rContent.length) {
          if (rContent.startsWith("<TableCell", i) || rContent.startsWith("<td", i)) {
            let tagStart = i;
            // find the end of the opening tag
            let inQuotes = false;
            let inCurlies = 0;
            let j = i;
            while (j < rContent.length) {
              const char = rContent[j];
              if (char === '"' || char === "'") {
                if (!inQuotes) inQuotes = char;
                else if (inQuotes === char) inQuotes = false;
              } else if (char === '{' && !inQuotes) {
                inCurlies++;
              } else if (char === '}' && !inQuotes) {
                inCurlies--;
              } else if (char === '>' && !inQuotes && inCurlies === 0) {
                break;
              }
              j++;
            }
            
            let tagStr = rContent.substring(tagStart, j + 1);
            let headerText = headers[cellIdx] || "";
            cellIdx++;
            
            if (tagStr.includes("colSpan") || tagStr.includes("data-label")) {
              newRContent += tagStr;
            } else {
              let isSelfClosing = tagStr.endsWith("/>");
              let insertPos = isSelfClosing ? tagStr.length - 2 : tagStr.length - 1;
              let labelAttr = ` data-label="${headerText.replace(/"/g, '&quot;')}"`;
              newRContent += tagStr.substring(0, insertPos) + labelAttr + tagStr.substring(insertPos);
            }
            i = j + 1;
          } else {
            newRContent += rContent[i];
            i++;
          }
        }
        
        return `${rOpen}${newRContent}${rClose}`;
      });
      
      return `${open}${newBody}${close}`;
    });
  });
  
  if (content !== fs.readFileSync(filePath, "utf8")) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${file}`);
  }
}

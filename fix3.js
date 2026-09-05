const fs = require("fs");
const path = require("path");

const dir = "artifacts/admin-panel/src/pages";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));

function removeHiddenClasses(str) {
  return str.replace(/\b(hidden|sm:table-cell|md:table-cell|lg:table-cell|sm:hidden|md:hidden|lg:hidden)\b/g, "").replace(/\s{2,}/g, " ").trim();
}

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");
  
  // 1. Remove hidden classes from TableHead, TableCell, th, td
  const tagRegex = /(<(?:TableHead|TableCell|th|td)\b)([^>]*)(>)/g;
  content = content.replace(tagRegex, (match, open, attrs, close) => {
    let newAttrs = attrs;
    if (newAttrs.includes("className=")) {
      newAttrs = newAttrs.replace(/className=(["'])(.*?)\1/g, (m, quote, cls) => {
        const cleaned = removeHiddenClasses(cls);
        return cleaned ? `className=${quote}${cleaned}${quote}` : "";
      });
      newAttrs = newAttrs.replace(/className=\{([^}]+)\}/g, (m, cls) => {
        const cleaned = removeHiddenClasses(cls);
        return cleaned ? `className={${cleaned}}` : "";
      });
    }
    return `${open}${newAttrs}${close}`;
  });

  // 2. Add data-labels
  if (content.includes("TableBody") || content.includes("<tbody")) {
    const tableRegex = /<(?:Table|table)[^>]*>[\s\S]*?<\/(?:Table|table)>/g;
    content = content.replace(tableRegex, (tableHtml) => {
      const headGroupRegex = /<(?:TableHeader|thead)[^>]*>([\s\S]*?)<\/(?:TableHeader|thead)>/;
      const headMatch = headGroupRegex.exec(tableHtml);
      if (!headMatch) return tableHtml;
      
      const headers = [];
      const headCellRegex = /<(?:TableHead|th)[^>]*>(.*?)<\/(?:TableHead|th)>/gs;
      let m;
      while ((m = headCellRegex.exec(headMatch[1])) !== null) {
        let inner = m[1];
        let text = inner.replace(/<[^>]+>/g, "").trim();
        if (text === "") {
          if (inner.includes("Checkbox") || inner.includes("type=\"checkbox\"")) text = "Select";
          else if (inner.includes("Action") || inner.includes("Edit") || inner.includes("Eye") || m[0].includes("w-[44px]") || m[0].includes("w-[80px]")) text = "Actions";
        }
        headers.push(text);
      }
      
      const bodyRegex = /(<(?:TableBody|tbody)[^>]*>)([\s\S]*?)(<\/(?:TableBody|tbody)>)/g;
      return tableHtml.replace(bodyRegex, (match, open, bodyContent, close) => {
        const rowRegex = /(<(?:TableRow|tr)[^>]*>)([\s\S]*?)(<\/(?:TableRow|tr)>)/g;
        const newBody = bodyContent.replace(rowRegex, (rMatch, rOpen, rContent, rClose) => {
          let cellIdx = 0;
          let i = 0;
          let newRContent = "";
          while (i < rContent.length) {
            if (rContent.startsWith("<TableCell", i) || rContent.startsWith("<td", i)) {
              let tagStart = i;
              let inQuotes = false;
              let inCurlies = 0;
              let j = i;
              while (j < rContent.length) {
                const char = rContent[j];
                if (char === '"' || char === "'") {
                  if (!inQuotes) inQuotes = char;
                  else if (inQuotes === char) inQuotes = false;
                } else if (char === '{' && !inQuotes) inCurlies++;
                else if (char === '}' && !inQuotes) inCurlies--;
                else if (char === '>' && !inQuotes && inCurlies === 0) break;
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
  }

  // 3. Page layout classes
  // A standard admin-page usually has a div wrapping the page header.
  // We can just find `<div className="flex flex-col sm:flex-row justify-between` and add `page-header`
  content = content.replace(/className=(["'])([^"']*(?:justify-between|items-center)[^"']*)\1/g, (match, q, cls) => {
    if (cls.includes("page-header") || cls.includes("page-filters") || cls.includes("page-actions")) return match;
    
    // Heuristic for page-header
    if ((cls.includes("justify-between") && cls.includes("flex-col") && cls.includes("sm:flex-row")) || 
        (cls.includes("justify-between") && cls.includes("items-center") && cls.includes("gap-"))) {
      // If it contains "mb-6" or "mb-4" or similar it's likely a header
      if (cls.includes("mb-")) return `className=${q}page-header ${cls}${q}`;
    }
    return match;
  });

  if (content !== fs.readFileSync(filePath, "utf8")) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${file}`);
  }
}

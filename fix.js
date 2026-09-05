const fs = require("fs");
const path = require("path");

const dir = "artifacts/admin-panel/src/pages";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");
  
  if (!content.includes("TableBody") && !content.includes("<tbody")) continue;

  let out = "";
  let pos = 0;
  
  // Find tables
  const tableRegex = /<(?:Table|table)[^>]*>[\s\S]*?<\/(?:Table|table)>/g;
  
  content = content.replace(tableRegex, (tableHtml) => {
    // extract headers
    const headRegex = /<(?:TableHead|th)[^>]*>(.*?)<\/(?:TableHead|th)>/g;
    const headers = [];
    let m;
    while ((m = headRegex.exec(tableHtml)) !== null) {
      // strip inner tags
      let text = m[1].replace(/<[^>]+>/g, "").trim();
      headers.push(text);
    }
    
    if (headers.length === 0) return tableHtml; // no headers found
    
    // Now replace TableCell / td within TableRow / tr
    // Wait, some rows are in thead, we should only process tbody
    
    const bodyRegex = /(<(?:TableBody|tbody)[^>]*>)([\s\S]*?)(<\/(?:TableBody|tbody)>)/g;
    return tableHtml.replace(bodyRegex, (match, open, bodyContent, close) => {
      
      const rowRegex = /(<(?:TableRow|tr)[^>]*>)([\s\S]*?)(<\/(?:TableRow|tr)>)/g;
      
      const newBody = bodyContent.replace(rowRegex, (rMatch, rOpen, rContent, rClose) => {
        let cellIdx = 0;
        // fix cell regex to not grab the trailing slash if it's an empty element
        // we can just match the tag open name and attributes separately
        const cellRegex = /(<(?:TableCell|td))((?:\s+[^>]*?)?)(\s*\/?>)/g;
        
        const newRContent = rContent.replace(cellRegex, (cMatch, cTag, cAttrs, cEnd) => {
          // cTag: "<TableCell"
          // cAttrs: ' className="foo" /' or ' className="foo"' or ' /'
          // cEnd: ">"
          
          let attrs = cAttrs;
          let isSelfClosing = false;
          if (attrs.endsWith('/')) {
            attrs = attrs.slice(0, -1);
            isSelfClosing = true;
          }
          if (cEnd.startsWith('/')) {
            isSelfClosing = true;
            cEnd = cEnd.substring(1);
          }
          
          if (attrs.includes("colSpan")) {
            return cMatch;
          }
          
          let header = headers[cellIdx] || "";
          cellIdx++;
          
          if (attrs.includes("data-label")) {
            return cMatch; // already has it
          }
          
          const newEnd = (isSelfClosing ? " />" : ">");
          return `${cTag}${attrs} data-label="${header.replace(/"/g, '&quot;')}"${newEnd}`;
        });
        
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

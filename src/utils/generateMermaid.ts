export const generateMermaidDiagram = (repoTree: any[], repoName: string) => {
    let diagram = `graph TD;\n`;
    diagram += `A[${repoName}] --> Root;\n`;
  
    repoTree.forEach((item) => {
      const pathParts = item.path.split('/');
      if (pathParts.length === 1) {
        diagram += `Root --> ${item.path.replace(/\W/g, '')}[${item.path}];\n`;
      } else {
        for (let i = 1; i < pathParts.length; i++) {
          const parent = pathParts.slice(0, i).join('').replace(/\W/g, '');
          const child = pathParts.slice(0, i + 1).join('').replace(/\W/g, '');
          diagram += `${parent} --> ${child}[${pathParts[i]}];\n`;
        }
      }
    });
  
    return diagram;
  };
  
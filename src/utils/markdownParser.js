/**
 * 专业的 Markdown 解析器
 * 借鉴 Docusaurus 的处理方式
 */

// YAML Front Matter 解析器
export const parseFrontMatter = (content) => {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return {
      data: {},
      content: content
    };
  }
  
  const frontMatterText = match[1];
  const markdownContent = match[2];
  
  // 简单的 YAML 解析
  const data = {};
  frontMatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      // 处理不同类型的值
      if (value === 'true') data[key] = true;
      else if (value === 'false') data[key] = false;
      else if (/^\d+$/.test(value)) data[key] = parseInt(value);
      else data[key] = value.replace(/^["']|["']$/g, ''); // 移除引号
    }
  });
  
  return {
    data,
    content: markdownContent
  };
};

// 改进的 Markdown 渲染器
export const renderMarkdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // 首先解析 front matter
  const { content } = parseFrontMatter(markdown);
  
  const lines = content.split('\n');
  const result = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeBlockLang = '';
  let inList = false;
  let listItems = [];
  let listType = 'ul'; // 'ul' 或 'ol'
  let inTable = false;
  let tableRows = [];
  let paragraphBuffer = [];
  let inBlockquote = false;
  let blockquoteContent = [];
  
  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const content = paragraphBuffer.join(' ').trim();
      if (content) {
        result.push(`<p class="markdown-paragraph">${processInlineMarkdown(content)}</p>`);
      }
      paragraphBuffer = [];
    }
  };
  
  const flushList = () => {
    if (listItems.length > 0) {
      const tag = listType === 'ol' ? 'ol' : 'ul';
      result.push(`<${tag} class="markdown-list">${listItems.join('')}</${tag}>`);
      listItems = [];
      inList = false;
    }
  };
  
  const flushTable = () => {
    if (tableRows.length > 0) {
      result.push(`<table class="markdown-table">${tableRows.join('')}</table>`);
      tableRows = [];
      inTable = false;
    }
  };
  
  const flushBlockquote = () => {
    if (blockquoteContent.length > 0) {
      const content = blockquoteContent.join('\n');
      result.push(`<blockquote class="markdown-blockquote">${processInlineMarkdown(content)}</blockquote>`);
      blockquoteContent = [];
      inBlockquote = false;
    }
  };
  
  const processInlineMarkdown = (text) => {
    return text
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong class="markdown-bold">$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/g, '<em class="markdown-italic">$1</em>')
      // 删除线
      .replace(/~~(.*?)~~/g, '<del class="markdown-strikethrough">$1</del>')
      // 行内代码
      .replace(/`([^`]+)`/g, '<code class="markdown-inline-code">$1</code>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="markdown-link" target="_blank" rel="noopener noreferrer">$1</a>')
      // 图片
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="markdown-image" />')
      // 高亮文本
      .replace(/==(.*?)==/g, '<mark class="markdown-highlight">$1</mark>');
  };
  
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const originalLine = line;
    
    // 处理代码块
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        // 结束代码块
        const codeContent = codeBlockContent.join('\n');
        const escapedContent = escapeHtml(codeContent);
        const langDisplay = codeBlockLang || 'text';
        
        // 为复制按钮生成唯一ID
        const copyId = `copy-btn-${Math.random().toString(36).substr(2, 9)}`;
        
        result.push(`
          <div class="markdown-code-block">
            <div class="code-block-header">
              <div class="code-block-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="code-block-lang">${langDisplay}</span>
              <button class="code-block-copy" id="${copyId}" data-code="${escapeHtml(codeContent)}">
                📋 复制
              </button>
            </div>
            <pre class="code-block-content"><code class="language-${codeBlockLang}">${escapedContent}</code></pre>
          </div>
        `);
        
        // 添加复制功能的事件监听器
        setTimeout(() => {
          const copyBtn = document.getElementById(copyId);
          if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
              try {
                const codeText = copyBtn.getAttribute('data-code');
                // 解码HTML实体
                const decodedText = codeText
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'");
                
                await navigator.clipboard.writeText(decodedText);
                
                // 显示复制成功提示
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ 已复制';
                copyBtn.style.background = 'rgba(40, 167, 69, 0.3)';
                
                setTimeout(() => {
                  copyBtn.innerHTML = originalText;
                  copyBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                }, 2000);
              } catch (err) {
                console.error('复制失败:', err);
                copyBtn.innerHTML = '❌ 复制失败';
                setTimeout(() => {
                  copyBtn.innerHTML = '📋 复制';
                }, 2000);
              }
            });
          }
        }, 100);
        inCodeBlock = false;
        codeBlockContent = [];
        codeBlockLang = '';
      } else {
        // 开始代码块
        flushParagraph();
        flushList();
        flushTable();
        flushBlockquote();
        inCodeBlock = true;
        codeBlockLang = trimmedLine.substring(3).trim();
      }
      return;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(originalLine);
      return;
    }
    
    // 处理标题
    if (trimmedLine.startsWith('#')) {
      flushParagraph();
      flushList();
      flushTable();
      flushBlockquote();
      
      const level = (trimmedLine.match(/^#+/) || [''])[0].length;
      const text = trimmedLine.substring(level).trim();
      const headingId = `heading-${index}`;
      
      result.push(`
        <h${level} id="${headingId}" class="markdown-heading markdown-h${level}" data-heading-id="${headingId}">
          ${processInlineMarkdown(text)}
        </h${level}>
      `);
      return;
    }
    
    // 处理引用块
    if (trimmedLine.startsWith('>')) {
      flushParagraph();
      flushList();
      flushTable();
      
      const quoteContent = trimmedLine.substring(1).trim();
      blockquoteContent.push(quoteContent);
      inBlockquote = true;
      return;
    } else if (inBlockquote) {
      flushBlockquote();
    }
    
    // 处理列表
    const unorderedListMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
    const orderedListMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    
    if (unorderedListMatch || orderedListMatch) {
      flushParagraph();
      flushTable();
      flushBlockquote();
      
      const listContent = unorderedListMatch ? unorderedListMatch[1] : orderedListMatch[2];
      const currentListType = unorderedListMatch ? 'ul' : 'ol';
      
      if (!inList || listType !== currentListType) {
        flushList();
        listType = currentListType;
        inList = true;
      }
      
      listItems.push(`<li class="markdown-list-item">${processInlineMarkdown(listContent)}</li>`);
      return;
    } else if (inList && trimmedLine === '') {
      // 空行不结束列表
      return;
    } else if (inList) {
      flushList();
    }
    
    // 处理表格
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      flushParagraph();
      flushList();
      flushBlockquote();
      
      if (trimmedLine.includes('---')) {
        // 表格分隔行，跳过
        return;
      }
      
      const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell);
      const isFirstRow = !inTable;
      
      if (isFirstRow) {
        // 表头
        const headerCells = cells.map(cell => 
          `<th class="markdown-table-header">${processInlineMarkdown(cell)}</th>`
        ).join('');
        tableRows.push(`<thead><tr>${headerCells}</tr></thead><tbody>`);
      } else {
        // 表格数据行
        const dataCells = cells.map(cell => 
          `<td class="markdown-table-cell">${processInlineMarkdown(cell)}</td>`
        ).join('');
        tableRows.push(`<tr>${dataCells}</tr>`);
      }
      
      inTable = true;
      return;
    } else if (inTable) {
      tableRows.push('</tbody>');
      flushTable();
    }
    
    // 处理分割线
    if (trimmedLine.match(/^[-*_]{3,}$/)) {
      flushParagraph();
      flushList();
      flushTable();
      flushBlockquote();
      result.push('<hr class="markdown-divider" />');
      return;
    }
    
    // 处理空行
    if (trimmedLine === '') {
      flushParagraph();
      return;
    }
    
    // 处理普通段落
    paragraphBuffer.push(originalLine.trim());
  });
  
  // 处理剩余内容
  flushParagraph();
  flushList();
  flushBlockquote();
  if (inTable) {
    tableRows.push('</tbody>');
    flushTable();
  }
  
  return result.join('');
};

// 解析文档大纲
export const parseDocumentOutline = (content) => {
  const { content: markdownContent } = parseFrontMatter(content);
  const lines = markdownContent.split('\n');
  const outline = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('#')) {
      const level = (trimmedLine.match(/^#+/) || [''])[0].length;
      const title = trimmedLine.replace(/^#+\s*/, '');
      const id = `heading-${index}`;
      
      if (title && level <= 4) {
        outline.push({
          id,
          title,
          level,
          lineIndex: index
        });
      }
    }
  });
  
  return outline;
};

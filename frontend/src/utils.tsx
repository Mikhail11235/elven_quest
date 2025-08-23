export const sanitizeHtml = (html: string) => {
    const allowedTags = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'span', '<br>'];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.body.querySelectorAll('*').forEach(element => {
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
            element.remove();
        }
    });
    return doc.body.innerHTML;
};
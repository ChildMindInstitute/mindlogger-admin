// Workaround issue with Google Translate in Chrome: https://mindlogger.atlassian.net/browse/MLA-131
// Patch described on GitHub: https://github.com/facebook/react/issues/11538#issuecomment-417504600

export function patchDOMForGoogleTranslate() {
  if (typeof Node === 'function' && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function(child) {
      if (child.parentNode !== this) {
        if (console) {
          console.error('Cannot remove a child from a different parent', child, this);
        }
        return child;
      }
      return originalRemoveChild.apply(this, arguments);
    }

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (console) {
          console.error('Cannot insert before a reference node from a different parent', referenceNode, this);
        }
        return newNode;
      }
      return originalInsertBefore.apply(this, arguments);
    }
  }
}

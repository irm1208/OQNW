const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    EDITABLE_TAGS.has(target.tagName) ||
    target.isContentEditable ||
    target.closest('[contenteditable="true"], [role="textbox"]') !== null
  );
}

function blockOutsideEditable(event: Event): void {
  if (!isEditableTarget(event.target)) {
    event.preventDefault();
  }
}

function blockClipboardShortcut(event: KeyboardEvent): void {
  if (isEditableTarget(event.target)) {
    return;
  }

  const modifierPressed = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();

  if (modifierPressed && (key === "c" || key === "x" || key === "v")) {
    event.preventDefault();
    event.stopPropagation();
  }
}

function blockDragStart(event: DragEvent): void {
  event.preventDefault();
}

/**
 * Adds a best-effort deterrent against copying public storefront content.
 * Form controls intentionally remain editable so customers can complete
 * search, sign-in, checkout, chat, and review flows.
 */
export function enableCopyProtection(): () => void {
  document.documentElement.classList.add("copy-protected");

  document.addEventListener("contextmenu", blockOutsideEditable, true);
  document.addEventListener("selectstart", blockOutsideEditable, true);
  document.addEventListener("copy", blockOutsideEditable, true);
  document.addEventListener("cut", blockOutsideEditable, true);
  document.addEventListener("paste", blockOutsideEditable, true);
  document.addEventListener("keydown", blockClipboardShortcut, true);
  document.addEventListener("dragstart", blockDragStart, true);

  return () => {
    document.documentElement.classList.remove("copy-protected");
    document.removeEventListener("contextmenu", blockOutsideEditable, true);
    document.removeEventListener("selectstart", blockOutsideEditable, true);
    document.removeEventListener("copy", blockOutsideEditable, true);
    document.removeEventListener("cut", blockOutsideEditable, true);
    document.removeEventListener("paste", blockOutsideEditable, true);
    document.removeEventListener("keydown", blockClipboardShortcut, true);
    document.removeEventListener("dragstart", blockDragStart, true);
  };
}
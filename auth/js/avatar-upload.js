import { updateUserProfile } from "../api/auth-api.js";
import { db, doc, setDoc } from "../api/firebase-config.js";
import { AVATAR_UPLOAD_ENDPOINT } from "./avatar-config.js";

// Upload only a 400x400 JPEG. Original photos never leave the browser.
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_SOURCE_PIXELS = 32_000_000;
const MAX_CROPPED_BYTES = 350_000;
const CANVAS_SIZE = 400;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function initProfilePhotoEditor({ getUser, getProfile, onSaved }) {
  const get = (id) => document.getElementById(id);
  const choose = get("avatar-choose-btn");
  const fileInput = get("avatar-file-input");
  const status = get("avatar-status");
  const dialog = get("avatar-editor");
  const canvas = get("avatar-crop-canvas");
  const zoomInput = get("avatar-zoom");
  const zoomValue = get("avatar-zoom-value");
  const error = get("avatar-dialog-error");
  const save = get("avatar-save-btn");
  const cancel = get("avatar-cancel-btn");
  const close = get("avatar-close-btn");
  if (
    ![
      choose,
      fileInput,
      status,
      dialog,
      canvas,
      zoomInput,
      zoomValue,
      error,
      save,
      cancel,
      close,
    ].every(Boolean)
  ) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) return;
  let image = null;
  let imageObjectURL = null;
  let zoom = 1;
  let dx = 0;
  let dy = 0;
  let busy = false;
  let dragging = false;
  let lastPointer = null;

  function flash(message, isError = false) {
    status.hidden = false;
    status.textContent = message;
    status.dataset.error = String(isError);
  }

  function dialogError(message = "") {
    error.textContent = message;
    error.hidden = !message;
  }

  function dimensions() {
    if (!image) return { width: CANVAS_SIZE, height: CANVAS_SIZE };
    const baseScale = Math.max(
      CANVAS_SIZE / image.naturalWidth,
      CANVAS_SIZE / image.naturalHeight,
    );
    return {
      width: image.naturalWidth * baseScale * zoom,
      height: image.naturalHeight * baseScale * zoom,
    };
  }

  function clampPosition() {
    const { width, height } = dimensions();
    dx = Math.min(
      Math.max(dx, (CANVAS_SIZE - width) / 2),
      (width - CANVAS_SIZE) / 2,
    );
    dy = Math.min(
      Math.max(dy, (CANVAS_SIZE - height) / 2),
      (height - CANVAS_SIZE) / 2,
    );
  }

  function redraw() {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    if (!image) return;
    clampPosition();
    const { width, height } = dimensions();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      (CANVAS_SIZE - width) / 2 + dx,
      (CANVAS_SIZE - height) / 2 + dy,
      width,
      height,
    );
  }

  function isOpen() {
    return !dialog.hidden;
  }

  function closeEditor(force = false) {
    if (busy && !force) return;
    dialog.hidden = true;
    document.body.classList.remove("avatar-dialog-open");
    dragging = false;
    lastPointer = null;
    image = null;
    if (imageObjectURL) URL.revokeObjectURL(imageObjectURL);
    imageObjectURL = null;
    fileInput.value = "";
    choose.focus();
  }

  function openFileChooser() {
    if (!busy) fileInput.click();
  }
  choose.addEventListener("click", openFileChooser);
  cancel.addEventListener("click", () => closeEditor());
  close.addEventListener("click", () => closeEditor());

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      flash("Choose a JPG, PNG or WEBP image.", true);
      fileInput.value = "";
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      flash("The original image must be 2 MB or smaller.", true);
      fileInput.value = "";
      return;
    }
    if (imageObjectURL) URL.revokeObjectURL(imageObjectURL);
    imageObjectURL = URL.createObjectURL(file);
    const next = new Image();
    try {
      next.src = imageObjectURL;
      await next.decode();
      if (next.naturalWidth * next.naturalHeight > MAX_SOURCE_PIXELS) {
        throw new Error(
          "This image is too large. Choose one with a lower resolution.",
        );
      }
      if (!next.naturalWidth || !next.naturalHeight)
        throw new Error("This image cannot be opened.");
    } catch (e) {
      flash(
        e.message || "This image could not be opened. Please try another.",
        true,
      );
      URL.revokeObjectURL(imageObjectURL);
      imageObjectURL = null;
      fileInput.value = "";
      return;
    }
    image = next;
    dx = 0;
    dy = 0;
    zoom = 1;
    zoomInput.value = "1";
    zoomValue.textContent = "100%";
    dialogError();
    status.hidden = true;
    dialog.hidden = false;
    document.body.classList.add("avatar-dialog-open");
    redraw();
    canvas.focus();
  });

  zoomInput.addEventListener("input", () => {
    zoom = Number(zoomInput.value) || 1;
    zoomValue.textContent = `${Math.round(zoom * 100)}%`;
    redraw();
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (!image || busy || (event.pointerType === "mouse" && event.button !== 0))
      return;
    dragging = true;
    lastPointer = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!dragging || !lastPointer || !image) return;
    const rect = canvas.getBoundingClientRect();
    const scale = CANVAS_SIZE / rect.width;
    dx += (event.clientX - lastPointer.x) * scale;
    dy += (event.clientY - lastPointer.y) * scale;
    lastPointer = { x: event.clientX, y: event.clientY };
    redraw();
  });
  const stopDrag = () => {
    dragging = false;
    lastPointer = null;
  };
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);
  canvas.addEventListener("lostpointercapture", stopDrag);

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeEditor();
      return;
    }
    if (
      event.target === canvas &&
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      event.preventDefault();
      const step = event.shiftKey ? 18 : 7;
      if (event.key === "ArrowLeft") dx -= step;
      if (event.key === "ArrowRight") dx += step;
      if (event.key === "ArrowUp") dy -= step;
      if (event.key === "ArrowDown") dy += step;
      redraw();
    }
    if (event.key === "Tab") {
      const items = [
        ...dialog.querySelectorAll(
          'button:not(:disabled), input[type="range"], canvas[tabindex]',
        ),
      ].filter((el) => el.getClientRects().length);
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  function makeBlob(quality) {
    return new Promise((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(new Error("Could not prepare your photo.")),
        "image/jpeg",
        quality,
      ),
    );
  }

  save.addEventListener("click", async () => {
    if (!image || busy) return;
    if (
      !AVATAR_UPLOAD_ENDPOINT ||
      !/^https:\/\//.test(AVATAR_UPLOAD_ENDPOINT)
    ) {
      dialogError(
        "Photo uploads aren't configured yet. Please contact the site administrator.",
      );
      return;
    }
    const user = getUser();
    if (!user) {
      dialogError("Your session expired. Please sign in again.");
      return;
    }
    busy = true;
    save.disabled = true;
    cancel.disabled = true;
    close.disabled = true;
    save.textContent = "Saving…";
    dialogError();
    try {
      // 400x400 JPEG, even when the uploaded source was PNG or WEBP.
      let imageBlob;
      for (const quality of [0.86, 0.77, 0.66]) {
        imageBlob = await makeBlob(quality);
        if (imageBlob.size <= MAX_CROPPED_BYTES) break;
      }
      if (imageBlob.size > MAX_CROPPED_BYTES)
        throw new Error(
          "The processed photo is still too large. Try another image.",
        );
      const idToken = await user.getIdToken();
      const response = await fetch(AVATAR_UPLOAD_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "image/jpeg",
        },
        body: imageBlob,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Upload failed. Please try again.");
      const url = new URL(result.url || "");
      if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com")
        throw new Error("The upload service returned an invalid image URL.");
      // Save both places: Firestore overrides Google photo; Auth supports other apps.
      await Promise.all([
        updateUserProfile(user, { photoURL: url.href }),
        setDoc(
          doc(db, "users", user.uid, "public", "profile"),
          { photoURL: url.href },
          { merge: true },
        ),
      ]);
      onSaved(url.href, getProfile());
      closeEditor(true);
      flash("Profile photo updated successfully.");
    } catch (e) {
      console.error("Avatar update failed:", e);
      dialogError(
        e.message || "Unable to update your photo. Please try again.",
      );
    } finally {
      busy = false;
      save.disabled = false;
      cancel.disabled = false;
      close.disabled = false;
      save.textContent = "Save photo";
    }
  });

  // Keep the dialog invisible to assistive tech until an image is chosen.
  dialog.hidden = true;
}

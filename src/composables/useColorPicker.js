/**
 * useColorPicker — composable encapsulating all color-picker logic.
 * Handles HSV state, gradient canvas rendering, hue slider, and hex input.
 */
import { ref, reactive, computed, nextTick } from 'vue'

// ── Color conversion helpers ─────────────────────────────────────────────────

export function hsvToRgb(h, s, v) {
  s /= 100
  v /= 100
  const i = Math.floor(h / 60) % 6
  const f = h / 60 - Math.floor(h / 60)
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  const channels = [
    [v, t, p],
    [q, v, p],
    [p, v, t],
    [p, q, v],
    [t, p, v],
    [v, p, q],
  ][i]
  return channels.map((x) => Math.round(x * 255))
}

export function rgbToHex(r, g, b) {
  return [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  return [h, Math.round(s * 100), Math.round(v * 100)]
}

// ── Composable ───────────────────────────────────────────────────────────────

export function useColorPicker(initialColor = '#4F46E5') {
  const isOpen = ref(false)

  const picker = reactive({
    hue: 240,
    saturation: 70,
    brightness: 90,
    cursorX: 0,
    cursorY: 0,
  })

  // Template refs — must be assigned externally via gradientCanvasRef / wrapperRef
  const gradientCanvasRef = ref(null)
  const wrapperRef = ref(null)

  // The authoritative color value
  const color = ref(initialColor)
  const hexInputRaw = ref(initialColor.replace('#', '').toUpperCase())

  // ── Sync helpers ────────────────────────────────────────────────────────────
  function syncPickerFromHex(hex) {
    const [r, g, b] = hexToRgb(hex.replace('#', ''))
    const [h, s, v] = rgbToHsv(r, g, b)
    picker.hue = h
    picker.saturation = s
    picker.brightness = v
  }

  function applyPickerToColor() {
    const [r, g, b] = hsvToRgb(picker.hue, picker.saturation, picker.brightness)
    color.value = '#' + rgbToHex(r, g, b)
    hexInputRaw.value = rgbToHex(r, g, b).toUpperCase()
    nextTick(drawCanvas)
  }

  // ── Canvas ──────────────────────────────────────────────────────────────────
  function drawCanvas() {
    const canvas = gradientCanvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = `hsl(${picker.hue}, 100%, 50%)`
    ctx.fillRect(0, 0, W, H)

    const gW = ctx.createLinearGradient(0, 0, W, 0)
    gW.addColorStop(0, 'rgba(255,255,255,1)')
    gW.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gW
    ctx.fillRect(0, 0, W, H)

    const gB = ctx.createLinearGradient(0, 0, 0, H)
    gB.addColorStop(0, 'rgba(0,0,0,0)')
    gB.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = gB
    ctx.fillRect(0, 0, W, H)

    // Place cursor
    const wrap = wrapperRef.value
    if (wrap) {
      const wW = wrap.offsetWidth || W
      const wH = wrap.offsetHeight || H
      picker.cursorX = (picker.saturation / 100) * wW
      picker.cursorY = (1 - picker.brightness / 100) * wH
    }
  }

  // ── Interaction ─────────────────────────────────────────────────────────────
  function pickAtPoint(x, y) {
    const wrap = wrapperRef.value
    if (!wrap) return
    const W = wrap.offsetWidth
    const H = wrap.offsetHeight
    picker.cursorX = Math.max(0, Math.min(x, W))
    picker.cursorY = Math.max(0, Math.min(y, H))
    picker.saturation = Math.round((picker.cursorX / W) * 100)
    picker.brightness = Math.round((1 - picker.cursorY / H) * 100)
    applyPickerToColor()
  }

  function onWrapperMouseDown(e) {
    const rect = wrapperRef.value.getBoundingClientRect()
    pickAtPoint(e.clientX - rect.left, e.clientY - rect.top)

    const onMove = (ev) => {
      const r = wrapperRef.value.getBoundingClientRect()
      pickAtPoint(ev.clientX - r.left, ev.clientY - r.top)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function onWrapperTouchStart(e) {
    e.preventDefault()
    const touch = e.touches[0]
    const rect = wrapperRef.value.getBoundingClientRect()
    pickAtPoint(touch.clientX - rect.left, touch.clientY - rect.top)

    const onMove = (ev) => {
      const t = ev.touches[0]
      const r = wrapperRef.value.getBoundingClientRect()
      pickAtPoint(t.clientX - r.left, t.clientY - r.top)
    }
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
  }

  function onHueChange() {
    applyPickerToColor()
  }

  function onHexInput(rawValue) {
    let h = rawValue.replace('#', '').trim()
    if (h.length === 3) h = h.split('').map((c) => c + c).join('')
    if (/^[0-9A-Fa-f]{6}$/.test(h)) {
      color.value = '#' + h
      syncPickerFromHex(color.value)
      nextTick(drawCanvas)
    }
  }

  // ── Open / close ────────────────────────────────────────────────────────────
  function open(currentColor) {
    color.value = currentColor
    hexInputRaw.value = currentColor.replace('#', '').toUpperCase()
    syncPickerFromHex(currentColor)
    isOpen.value = true
    nextTick(drawCanvas)
  }

  function toggle(currentColor) {
    if (isOpen.value) {
      isOpen.value = false
    } else {
      open(currentColor)
    }
  }

  function close() {
    isOpen.value = false
  }

  // ── Computed ─────────────────────────────────────────────────────────────────
  const displayHex = computed(() => '#' + color.value.replace('#', '').toUpperCase())
  const hueColor = computed(() => `hsl(${picker.hue}, 100%, 50%)`)
  const opacityGradient = computed(
    () => `linear-gradient(to right, transparent, ${color.value})`
  )

  return {
    isOpen,
    picker,
    color,
    hexInputRaw,
    displayHex,
    hueColor,
    opacityGradient,
    gradientCanvasRef,
    wrapperRef,
    drawCanvas,
    onWrapperMouseDown,
    onWrapperTouchStart,
    onHueChange,
    onHexInput,
    open,
    toggle,
    close,
  }
}

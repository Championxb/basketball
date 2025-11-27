export default {
  beforeMount(el, binding) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let startLeft = 0;
    let startTop = 0;

    const containerBoundary = binding.arg || true; // 默认为限制在父容器内
    const boundary = binding.value || null; // 自定义边界，若无则为 null

    const mouseMoveHandler = (e) => {
      if (!isDragging) return;

      // 获取鼠标的相对移动距离
      const deltaX = e.clientX - offsetX;
      const deltaY = e.clientY - offsetY;

      // 根据父容器或自定义边界进行限制
      let newLeft = startLeft + deltaX;
      let newTop = startTop + deltaY;

      if (containerBoundary) {
        // 限制在父容器内
        const parentRect = el.parentElement.getBoundingClientRect();
        const maxLeft = parentRect.width - el.offsetWidth;
        const maxTop = parentRect.height - el.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
      } else if (boundary) {
        // 限制在自定义边界内
        newLeft = Math.max(boundary.left, Math.min(newLeft, boundary.right - el.offsetWidth));
        newTop = Math.max(boundary.top, Math.min(newTop, boundary.bottom - el.offsetHeight));
      }

      // 更新元素的位置
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    };

    const mouseUpHandler = () => {
      isDragging = false;
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    const mouseDownHandler = (e) => {
      isDragging = true;
      offsetX = e.clientX;
      offsetY = e.clientY;

      // 记录元素当前位置
      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    // 添加拖拽事件监听
    el.style.position = "absolute";
    el.addEventListener("mousedown", mouseDownHandler);
  },

  unmounted(el) {
    // 移除事件监听
    el.removeEventListener("mousedown", this.mouseDownHandler);
  }
};

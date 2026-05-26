<!-- category: 前端技巧 -->
# CSS 实用技巧

掌握这些 CSS 技巧，让你的前端开发效率翻倍。

## 布局技巧

### Flexbox 居中

最简洁的水平垂直居中方案：

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Grid 自适应网格

使用 `auto-fill` 和 `minmax` 实现自适应列数：

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
```

## 视觉效果

### 毛玻璃效果（Glassmorphism）

Apple 官网常用的毛玻璃效果：

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
}
```

### 渐变边框

利用 `border-image` 实现渐变边框效果：

```css
.gradient-border {
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #667eea, #764ba2) 1;
}
```

## 动画技巧

### 平滑过渡

使用 `cubic-bezier` 自定义缓动函数：

```css
.smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 关键帧动画

创建呼吸灯效果：

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s infinite;
}
```

## 实用选择器

- `:has()` — 父元素选择器，根据子元素状态应用样式
- `:is()` — 简化复杂选择器，减少重复
- `:where()` — 类似 `:is()`，但权重为 0
- `@container` — 容器查询，基于父容器尺寸应用样式

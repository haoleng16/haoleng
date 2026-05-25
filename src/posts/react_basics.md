# React 基础入门

React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发并维护。

## 核心概念

### 组件（Component）

组件是 React 应用的基本构建块。每个组件都是一个独立的、可复用的 UI 单元。

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### JSX 语法

JSX 是 JavaScript 的语法扩展，允许你在 JS 中编写类似 HTML 的代码。

```jsx
const element = <h1>Hello, world!</h1>;
```

> JSX 最终会被编译为 `React.createElement()` 调用。

## 状态管理

### useState

`useState` 是最基本的 Hook，用于在函数组件中管理状态。

```jsx
const [count, setCount] = useState(0);
```

### useEffect

`useEffect` 用于处理副作用，比如数据请求、订阅、DOM 操作等。

```jsx
useEffect(() => {
  document.title = `点击了 ${count} 次`;
}, [count]);
```

## 最佳实践

- **组件拆分**：保持组件小而专注，每个组件只负责一件事
- **状态提升**：将共享状态提升到最近的公共父组件
- **避免不必要的渲染**：使用 `React.memo` 和 `useMemo` 优化性能
- **自定义 Hook**：将可复用的逻辑抽取为自定义 Hook

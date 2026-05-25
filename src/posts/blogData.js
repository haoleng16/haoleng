import howtospeedupModel from './howtospeedup_model.md?raw'
import reactBasics from './react_basics.md?raw'
import cssTricks from './css_tricks.md?raw'

export const blogCategories = [
  {
    name: 'AI 模型优化',
    icon: '🤖',
    posts: [
      {
        id: 'howtospeedup_model',
        title: '如何加速模型推理',
        content: howtospeedupModel,
      },
    ],
  },
  {
    name: 'React 学习笔记',
    icon: '⚛️',
    posts: [
      {
        id: 'react_basics',
        title: 'React 基础入门',
        content: reactBasics,
      },
    ],
  },
  {
    name: '前端技巧',
    icon: '🎨',
    posts: [
      {
        id: 'css_tricks',
        title: 'CSS 实用技巧',
        content: cssTricks,
      },
    ],
  },
]

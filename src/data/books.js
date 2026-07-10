// Book data for the 3D bookshelf.
// Only one real book ("文案训练手册") exists; it is replicated on the shelf.
import coverImg from '../assets/books/copywriting.png'

const PDF_BASE = import.meta.env.BASE_URL

export const books = [
  {
    id: 'copywriting',
    title: '文案训练手册',
    author: 'HaoLeng',
    cover: coverImg,
    spineColor: '#141414',
    pageCount: 120,
    pdfPath: `${PDF_BASE}bookshelf/copywriting-training-handbook.pdf`,
    description: '一份适合放进书架长期阅读的文案训练资料。',
  },
]

// Default export: the single book replicated N times to fill the shelf row.
export const shelfBooks = Array.from({ length: 9 }, () => books[0])

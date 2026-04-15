import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { name: 'Hot Coffee', image: '/hotCoffee.png', slug: 'hot-coffee' },
  { name: 'Ice Coffee', image: '/iceCoffee.png', slug: 'ice-coffee' },
  { name: 'Tea & Matcha', image: '/tea.png', slug: 'tea-matcha' },
  { name: 'Frappes & Blended', image: '/frappes.png', slug: 'frappes-blended' },
  { name: 'Non-Coffee & Refreshers', image: '/nonCoffee.png', slug: 'non-coffee-refreshers' },
]

const Categories = () => {
  return (
    <section className="w-full px-6 pb-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-[#3D5690] mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/menu/categories/${category.slug}`}
              className="flex flex-col items-center bg-[#D9D9D9] rounded-[20px] pt-4 pb-3 px-3 h-[220px] lg:h-[260px] text-center hover:opacity-90 transition-opacity"
            >
              <span className="text-[#3D5690] font-bold text-sm lg:text-base leading-tight">{category.name}</span>
              <div className="flex-1 flex items-end justify-center w-full mt-2">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={500}
                  height={500}
                  className="max-h-[180px] w-auto object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
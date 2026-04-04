import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Filters({ filters, onChange }) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: false,
    color: false,
  });

  const toggle = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const categories = ['t-shirts', 'shirts', 'pants', 'dresses', 'jackets', 'accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Gray', 'Navy', 'Pink', 'Green'];

  const Section = ({ id, label, children }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => toggle(id)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-semibold text-gray-700">{label}</span>
        {openSections[id] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>
      {openSections[id] && <div className="mt-3">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-800">Filters</h3>
        <button
          onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', size: '', color: '' })}
          className="text-sm text-pink-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <Section id="category" label="Category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={(e) => onChange({ ...filters, category: e.target.value })}
                className="accent-pink-600"
              />
              <span className="text-sm text-gray-600 capitalize">{cat}</span>
            </label>
          ))}
          {filters.category && (
            <button
              onClick={() => onChange({ ...filters, category: '' })}
              className="text-xs text-pink-600 hover:underline"
            >
              Show all
            </button>
          )}
        </div>
      </Section>

      <Section id="price" label="Price Range">
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>
      </Section>

      <Section id="size" label="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onChange({ ...filters, size: filters.size === size ? '' : size })}
              className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${
                filters.size === size
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'border-gray-300 text-gray-600 hover:border-pink-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </Section>

      <Section id="color" label="Color">
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...filters, color: filters.color === color ? '' : color })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filters.color === color
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'border-gray-300 text-gray-600 hover:border-pink-400'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

import React from 'react'

export default function RadioCardFilter({ register, item }) {
  return (
    <>
      <li>
        <input
          type="radio"
          id={`filterselection-${item.value}`}
          name="selection"
          className={`hidden peer`}
          value={item.value}
          {...register('selection')}
          required
          defaultChecked={item.value === 4}
        />
        <label
          htmlFor={`filterselection-${item.value}`}
          className={`group inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-300 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500   hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 peer-checked:bg-gray-100 ${
            item.value === 7
              ? 'peer-checked:border-fav-red-light peer-checked:text-fav-red-light'
              : 'peer-checked:border-blue-600 peer-checked:text-blue-600'
          }`}>
          <div className="block">
            <div className="w-full text-sm font-semibold">{item.label}</div>
          </div>
          <div className="group-hover:scale-150 transition-transform delay-100 ease-in">
            {item.icon}
          </div>
        </label>
      </li>
    </>
  )
}

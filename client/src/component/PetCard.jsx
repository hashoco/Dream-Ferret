export default function PetCard({ name, image, tag, description }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden border border-orange-100">
      <div className="p-4 flex flex-col items-center text-center">
        {/* 동그란 이미지 */}
        <div className="w-28 h-28 mb-3 rounded-full overflow-hidden border-4 border-orange-200">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* 이름 */}
        <h3 className="text-lg font-bold text-stone-800 mb-1">{name}</h3>

        {/* 태그 */}
        <span className="text-xs bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-medium mb-2">
          {tag}
        </span>

        {/* 설명 */}
        <p className="text-sm text-stone-600 leading-snug">{description}</p>
      </div>
    </div>
  );
}

// ✅ RegisterPage.jsx (반응형 고려 버전)
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function RegisterPage() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    naver_id: '',
    name: '',
    gender: '',
    age: '',
    birthday: '',
    snack: '',
    tags: [],
    description: '',
    notes: '',
    image: null,
    image_url: '',
  });
  const [ferrets, setFerrets] = useState([]);
  const [editing, setEditing] = useState(false);
  const imageInputRef = useRef(null);
  const extraImageInputRef = useRef(null);
  const [extraImages, setExtraImages] = useState([]);

  const handleExtraImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 8) {
      alert('최대 8장까지만 업로드할 수 있습니다.');

      if (extraImageInputRef.current) {
        extraImageInputRef.current.value = '';
      }
      return;
    }

    setExtraImages(selectedFiles);
  };

  useEffect(() => {
    const naver_id = user?.id;

    if (!naver_id) return;
    fetch(`${API_BASE}/api/profiles?user_id=${naver_id}`)
      .then((res) => res.json())
      .then(setFerrets)
      .catch((err) => console.error('조회 실패:', err));
  }, [user]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleCardClick = async (ferret) => {
    setForm(ferret);
    setEditing(true);

    // ✅ 해당 ferret_id에 대한 추가 이미지 조회
    const extraRes = await fetch(`${API_BASE}/api/upload-extra/${ferret.id}`);
    const extraData = await extraRes.json();
    setExtraImages(extraData); // extraImages에 URL 배열 세팅
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, gender, age, description, image } = form;

    if (!name) return alert('이름을 입력하세요.');
    if (!gender) return alert('성별을 선택하세요.');
    if (!age) return alert('나이를 입력하세요.');
    if (!description) return alert('우리아이 소개를 입력하세요.');
    if (!editing && !image) return alert('프로필 사진을 입력하세요.');

    let imageFilename = form.image_url;
    let id = form.id;

    // ✅ 1. 신규 등록 시 ID 먼저 생성
    if (!editing) {
      const idRes = await fetch(`${API_BASE}/api/profiles/id`);
      const idData = await idRes.json();
      id = idData.id;
    }

    // ✅ 2. 프로필 이미지 업로드
    if (image && image instanceof File) {
      const formData = new FormData();
      formData.append('image', image);
      const uploadRes = await fetch(`${API_BASE}/api/upload?id=${id}`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      imageFilename = uploadData.image_url;
    }

    // ✅ 3. 프로필 DB 저장
    const body = {
      ...form,
      id,
      user_id: user.id,
      email: user.email,
      image_url: imageFilename,
    };

    const url = editing
      ? `${API_BASE}/api/profiles/${id}`
      : `${API_BASE}/api/profiles`;
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (!res.ok) return alert('프로필 저장 실패');

    // ✅ 4. 추가 이미지 업로드
    if (extraImages.length > 0) {
      const formData = new FormData();
      extraImages.forEach((img) => formData.append('images', img));

      await fetch(`${API_BASE}/api/upload-extra?id=${id}`, {
        method: 'POST',
        body: formData,
      });
    }

    // ✅ 5. 완료 후 초기화 및 새로고침
    alert(`${form.name} ${editing ? '수정' : '등록'} 성공!`);
    handleNew();

    const updated = await fetch(
      `${API_BASE}/api/profiles?user_id=${user.id}`
    ).then((r) => r.json());
    setFerrets(updated);
  };
  
  const handleDelete = async () => {

    if (!form.id || !window.confirm('정말 삭제할까요?')) return;
    await fetch(`${API_BASE}/api/profiles/${form.id}`, { method: 'DELETE' });
    alert('삭제 성공');
    handleNew();
    const updated = await fetch(
      `${API_BASE}/api/profiles?user_id=${user.id}`
    ).then((r) => r.json());
    setFerrets(updated);

  };

  const handleNew = () => {
    setForm({
      id: '', name: '', gender: '', age: '', birthday: '', snack: '',
      tags: [], description: '', notes: '', image: null, image_url: ''
    });
    setExtraImages([]); // 추가 이미지 초기화
    setEditing(false);
    // ✅ 파일 input 초기화
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const TAG_LIST = ['장난꾸러기', '조용한 편', '사람 좋아함', '애교쟁이', '덕스프러버'];

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 8); // 최대 8장 제한
    setExtraImages(files);
  };

  return (

    <section className="min-h-screen bg-orange-50 px-4 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-4 xl:max-h-[80vh] overflow-y-auto pr-2">
          <div className="flex justify-between items-center">
            <h1
              className="text-2xl text-center mb-4 font-bold text-orange-500"
              style={{ fontFamily: "'Poor Story', sans-serif" }}
            >
              🐹 꼬물꼬물 친구들
            </h1>
            {editing && (
              <button
                onClick={handleNew}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm"
              >
                + 신규 등록
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ferrets.map((f) => (
              <div
                key={f.id}
                onClick={() => handleCardClick(f)}
                className="bg-white rounded-xl p-3 mx-1 shadow-md space-y-2 cursor-pointer hover:ring-2 hover:ring-orange-400"
              >
                <img
                  src={`${API_BASE}/${f.image_url}`}

                  alt={f.name}
                  className="w-full h-32 object-cover rounded"
                />
                <h4 className="font-bold text-stone-800 text-lg">{f.name}</h4>
                <p className="text-sm text-stone-600">{f.gender} / {f.age}세</p>
                <p className="text-sm text-stone-500 truncate">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-orange-100">
          {/* ✅ 제목 + 버튼 상단 고정 */}
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-orange-500"
              style={{ fontFamily: "'Poor Story', sans-serif" }}
            >
              🦦 프로필 {editing ? '수정' : '등록'}
            </h2>
            <div className="space-x-2">
              {editing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500"
                >
                  삭제
                </button>
              )}
              <button
                type="button" // ✅ submit 제거
                onClick={handleSubmit} // ✅ 직접 호출
                className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
              >
                {editing ? '수정하기' : '등록하기'}
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">이름</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">성별</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
                  <option value="">선택</option>
                  <option value="남아">남아</option>
                  <option value="여아">여아</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">나이</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">함께한날</label>
                <input
                  type="date"
                  name="birthday"
                  value={form.birthday ? form.birthday.slice(0, 10) : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">좋아하는 간식</label>
                <input name="snack" value={form.snack} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">성격 태그</label>
              <div className="flex flex-wrap gap-2">
                {TAG_LIST.map((tag) => (
                  <button key={tag} type="button" onClick={() => handleTagToggle(tag)} className={`px-3 py-1 rounded-full text-sm border ${form.tags.includes(tag) ? 'bg-orange-400 text-white' : 'bg-gray-100 text-stone-700'}`}>{tag}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">우리아이 소개</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-md h-18 resize-none" />
            </div>
            <div className="flex items-start justify-between gap-4">
              {/* 왼쪽: 파일 선택 */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-stone-700 mb-1">프로필 사진</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-60"
                  ref={imageInputRef}
                />
              </div>

              {/* 오른쪽: 미리보기 */}
              <div className="flex items-center">
                {form.image && (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="미리보기"
                    className="w-10 h-10 object-cover rounded shadow"
                  />
                )}
                {!form.image && form.image_url && (
                  <img
                    src={`${API_BASE}/${form.image_url}`}
                    alt="미리보기"
                    className="w-10 h-10 object-cover rounded shadow"
                  />
                )}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-stone-700 mb-1">추가 이미지 (최대 8장)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleExtraImageChange}
                  className="w-60"
                  ref={extraImageInputRef}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto max-w-[300px]">
                {extraImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={typeof img === 'string' ? `${API_BASE}/${img}` : URL.createObjectURL(img)}
                    alt={`미리보기${idx + 1}`}
                    className="w-10 h-10 object-cover rounded shadow border"
                  />
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>

  );
}
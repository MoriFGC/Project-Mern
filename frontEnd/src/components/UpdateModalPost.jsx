"use client";

import { Modal } from "flowbite-react";

export function UpdateModalPost({setEditPost, editPost, setIsEditing, handleUpdate}) {
  return (
    <Modal className="bg-black" show={true} onClose={() => setEditPost(null)}>
      <Modal.Header className="bg-black text-white border-b border-gray-600"><span className="text-white">Update Post</span></Modal.Header>
      <Modal.Body className="bg-black text-white">
        <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-1 font-bold text-white">Title:</label>
            <input 
              id="title"
              type="text" 
              placeholder='Inserisci Title...' 
              value={editPost.title} 
              onChange={(e) => setEditPost({...editPost, title:e.target.value})}
              required
              className="bg-gray-800 text-white border border-gray-600 rounded p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="content" className="mb-1 font-bold text-white">Content:</label>
            <textarea 
              id="content"
              placeholder='Inserisci Content...'
              value={editPost.content}
              onChange={(e) => setEditPost({...editPost, content:e.target.value})}
              required 
              className="bg-gray-800 text-white border border-gray-600 rounded p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="mb-1 font-bold text-white">Category:</label>
            <input 
              id="category"
              type="text" 
              placeholder='Inserisci Category...' 
              value={editPost.category} 
              onChange={(e) => setEditPost({...editPost, category:e.target.value})}  
              required
              className="bg-gray-800 text-white border border-gray-600 rounded p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="readTimeUnit" className="mb-1 font-bold text-white">Read Time Unit:</label>
            <input 
              id="readTimeUnit"
              type="text" 
              placeholder='Inserisci Unit...' 
              value={editPost.readTime.unit} 
              onChange={(e) => setEditPost({...editPost, readTime: {...editPost.readTime,unit: e.target.value}})} 
              required
              className="bg-gray-800 text-white border border-gray-600 rounded p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="readTimeValue" className="mb-1 font-bold text-white">Read Time Value:</label>
            <input 
              id="readTimeValue"
              type='number' 
              placeholder='Inserisci Value...' 
              value={editPost.readTime.value} 
              onChange={(e) => setEditPost({...editPost, readTime: {...editPost.readTime, value: parseInt(e.target.value) || 0}})} 
              required
              className="bg-gray-800 text-white border border-gray-600 rounded p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="cover" className="mb-1 font-bold text-white">Cover URL:</label>
            <input 
              id="cover"
              type="url" 
              placeholder='Inserisci Cover...' 
              value={editPost.cover} 
              onChange={(e) => setEditPost({...editPost, cover:e.target.value})}
              required
              className="bg-gray-800 text-white border border-gray-600 rounded p-2"
            />
          </div>

          <div className="flex flex-col space-y-2 mt-4">
            <button className="text-black bg-verde border-2 border-solid border-verde text-[20px] font-bold hover:text-white hover:bg-black rounded-lg p-5 font-mono"
              type='submit'>
              Update
            </button>
            <button className="text-black bg-[#ff0101] border-2 border-solid border-[#ff0101] text-[20px] font-bold hover:text-white hover:bg-black rounded-lg p-5 font-mono"
              onClick={() => setIsEditing(null)}
              type="button">
              Cancel
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
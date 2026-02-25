const incompleteBookList = document.querySelector('#incompleteBookList');
const completeBookList = document.querySelector('#completeBookList');

const books = JSON.parse(localStorage.getItem('books')) || [];

function renderBooks(bookList = books) {
	incompleteBookList.innerHTML = '';
	completeBookList.innerHTML = '';

	bookList.forEach((book) => {
		const bookElement = document.createElement('div');
		bookElement.setAttribute('data-bookid', book.id);
		bookElement.setAttribute('data-testid', 'bookItem');

		bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? 'Belum selesai' : 'Selesai dibaca'}
            </button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
            <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
    `;

		const toggleButton = bookElement.querySelector(
			'[data-testid="bookItemIsCompleteButton"]'
		);

		toggleButton.addEventListener('click', () => {
			Swal.fire({
				title: 'Apakah anda ingin mengubah status baca?',
				showCancelButton: true,
				icon: 'question',
				confirmButtonText: 'Iya',
			}).then((result) => {
				if (result.isConfirmed) {
					toggleReadStatus(book.id);
					Swal.fire('Berhasil', '', 'success');
				}
			});
		});

		const deleteBtn = bookElement.querySelector(
			'[data-testid="bookItemDeleteButton"]'
		);

		deleteBtn.addEventListener('click', () => {
			Swal.fire({
				title: 'Apakah anda ingin mengubah menghapus buku?',
				showCancelButton: true,
				icon: 'question',
				confirmButtonText: 'Iya',
			}).then((result) => {
				if (result.isConfirmed) {
					deleteBook(book.id);
					Swal.fire('Berhasil', '', 'success');
				}
			});
		});

		const editBtn = bookElement.querySelector(
			'[data-testid="bookItemEditButton"]'
		);

		editBtn.addEventListener('click', () => {
			openModal(book.id);
		});

		if (book.isComplete) {
			completeBookList.append(bookElement);
		} else {
			incompleteBookList.append(bookElement);
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	renderBooks();
});

const bookTitle = document.querySelector('#bookFormTitle');
const bookAuthor = document.querySelector('#bookFormAuthor');
const bookYear = document.querySelector('#bookFormYear');
const bookIsComplete = document.querySelector('#bookFormIsComplete');
const bookForm = document.querySelector('#bookForm');

bookForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const newBook = {
		id: new Date().getTime(),
		title: bookTitle.value,
		author: bookAuthor.value,
		year: Number(bookYear.value),
		isComplete: bookIsComplete.checked,
	};

	books.push(newBook);
	localStorage.setItem('books', JSON.stringify(books));
	renderBooks();

	Swal.fire({
		title: 'Berhasil',
		text: 'Berahasil menambah buku!',
		icon: 'success',
	});
});

function toggleReadStatus(bookId) {
	const book = books.find((book) => book.id == bookId);

	if (book) {
		book.isComplete = !book.isComplete;
		localStorage.setItem('books', JSON.stringify(books));
		renderBooks();
	}
}

function deleteBook(bookId) {
	const updatedBooks = books.filter((book) => book.id != bookId);

	books.length = 0;
	books.push(...updatedBooks);

	localStorage.setItem('books', JSON.stringify(books));
	renderBooks();
}

const searchBookTitle = document.querySelector('#searchBookTitle');
const searchBookForm = document.querySelector('#searchBook');

searchBookForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const keyword = searchBookTitle.value;

	if (!keyword) {
		renderBooks();
		return;
	} else {
		const result = books.filter((book) => book.title == keyword);
		renderBooks(result);
	}
});

const editModal = document.querySelector('#editModal');
const editForm = document.querySelector('#editBookForm');
const closeModalBtn = document.querySelector('#closeModal');

const editBookId = document.querySelector('#editBookId');
const editTitle = document.querySelector('#editTitle');
const editAuthor = document.querySelector('#editAuthor');
const editYear = document.querySelector('#editYear');
const editIsComplete = document.querySelector('#editIsComplete');

function openModal(bookId) {
	const book = books.find((book) => book.id == bookId);
	if (book) {
		editBookId.value = book.id;
		editTitle.value = book.title;
		editAuthor.value = book.author;
		editYear.value = book.year;
		editIsComplete.checked = book.isComplete;

		editModal.style.display = 'flex';
	}
}

closeModalBtn.addEventListener('click', () => {
	editModal.style.display = 'none';
});

editForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const id = editBookId.value;
	const bookIndex = books.findIndex((book) => book.id == id);

	if (bookIndex !== -1) {
		books[bookIndex].title = editTitle.value;
		books[bookIndex].author = editAuthor.value;
		books[bookIndex].year = Number(editYear.value);
		books[bookIndex].isComplete = editIsComplete.checked;

		localStorage.setItem('books', JSON.stringify(books));
		renderBooks();

		editModal.style.display = 'none';

		Swal.fire({
			title: 'Berhasil',
			text: 'Berhasil memperbarui data buku!',
			icon: 'success',
		});
	}
});

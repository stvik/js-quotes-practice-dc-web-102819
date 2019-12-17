// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener('DOMContentLoaded', () => {
	getQuotes()

	form = document.getElementById('new-quote-form')

	form.addEventListener('submit', createNewQuote)
	})


function getQuotes() {
	fetch('http://localhost:3000/quotes?_embed=likes')
	.then(resp => resp.json())
	.then(quotes => quotes.forEach(quote => renderQuote(quote)))
}

function renderQuote(quote) {
	let quoteList = document.getElementById('quote-list')

	let li = document.createElement('li')
	li.classList.add('quote-card') 
	li.id = `quote-li-${quote.id}`
	quoteList.append(li)

	let blockquote = document.createElement('blockquote')
	blockquote.classList.add('blockquote')
	blockquote.id = `blockquote-${quote.id}`
	li.append(blockquote)

	let p = document.createElement('p')
	p.classList.add('mb-0')
	p.innerText = quote.quote
	blockquote.append(p)

	let footer = document.createElement('footer')
	footer.classList.add('blockquote-footer')
	footer.innerText = quote.author
	blockquote.append(footer)

	let br = document.createElement('br')
	blockquote.append(br)

	let likeBtn = document.createElement('button')
	likeBtn.id = `like-btn-${quote.id}`
	likeBtn.classList.add('btn-success')
	likeBtn.innerHTML = `Likes: <span>${quote.likes ? quote.likes.length : '0'}</span>`
	blockquote.append(likeBtn)
	likeBtn.addEventListener('click', (e, quoteId) => addLike(event, quote.id))

	let deleteBtn = document.createElement('button')
	deleteBtn.classList.add('btn-danger')
	deleteBtn.innerText = "Delete"
	blockquote.append(deleteBtn)
	deleteBtn.addEventListener('click', (e, quoteId) => deleteQuote(event,quote.id))

	let editBtn = document.createElement('button')
	editBtn.classList.add('btn-warning')
	editBtn.id = `edit-btn-${quote.id}`
	editBtn.innerText = "Edit quote"
	blockquote.append(editBtn)
	editBtn.addEventListener('click', (e, quoteId, quoteText) => editQuoteForm(event, quote.id, quote.quote))

}



function editQuoteForm(event, quoteId, quoteText) {
	event.currentTarget.style.display = 'none'

	let blockquote = document.getElementById(`blockquote-${quoteId}`)

	let editForm = document.createElement('form')
	editForm.id = `edit-${quoteId}`
	blockquote.append(editForm)

	let div = document.createElement('div')
	div.classList.add('form-group')
	editForm.append(div)

	// let label = document.createElement('label')
	// label.innerText = 'Edit Quote'
	// div.append(label)

	let input = document.createElement('input')
	input.value = quoteText
	input.id = `edit-input-${quoteId}`
	input.classList.add('form-control')
	div.append(input)

	let submit = document.createElement('submit')
	submit.innerText = "Edit"
	submit.classList.add('btn')
	submit.classList.add('btn-warning')
	editForm.append(submit)

	submit.addEventListener('click', editQuote)
}


function editQuote(event) {
	event.preventDefault()

	let quoteId = event.target.parentElement.id.split('-')[1]
	
	let newQuote = document.getElementById(`edit-input-${quoteId}`).value

	let configOp = {
		method: "PATCH",
		headers: {
			'content-type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({'quote': newQuote})
	}

	fetch(`http://localhost:3000/quotes/${quoteId}`, configOp)
	.then(resp => resp.json())
	.then(quote => {
		let p = document.getElementById(`blockquote-${quote.id}`).querySelector('p')
		p.innerText = quote.quote
		document.getElementById(`edit-btn-${quote.id}`).style.display = 'inline'

	})

	event.target.parentElement.remove()



	// console.log(event.target.edit.value)

}

function createNewQuote(event) {
	event.preventDefault()

	let quoteText = event.target[0].value
	let author = event.target[1].value

	let postData = {
		'quote': quoteText,
		'author': author
	}

	let configOp = {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			"Accept": 'application/json'
		},
		body: JSON.stringify(postData)
	}


	fetch('http://localhost:3000/quotes', configOp)
	.then(resp => resp.json())
	.then(quote => renderQuote(quote))

	event.target.reset()

}

function deleteQuote(e, quoteId) {

	fetch(`http://localhost:3000/quotes/${quoteId}`,{
		method: 'DELETE'
	})
	.then(resp => {
		if (resp.ok){
			let arr = resp.url.split('/')
			let quoteId = arr[arr.length-1]
			document.getElementById(`quote-li-${quoteId}`).remove()
		}else {
			alert("Oops something went wrong")
		}
	})
	.catch(error => alert(error.message))

}

function addLike(event, quoteId, currentLikes) {
 

	let postBody = {
		'quoteId': quoteId
	}

	let configOp = {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Accept': "application/json"
		},
		body: JSON.stringify(postBody)
	}

	fetch('http://localhost:3000/likes', configOp)
	.then(resp => resp.json())
	.then(like => { 
		let button = document.getElementById(`like-btn-${like.quoteId}`)
		let currentLikes = parseInt(button.querySelector('span').innerText)
		button.innerHTML = `Likes: <span>${currentLikes + 1}</span>`
	})	



}












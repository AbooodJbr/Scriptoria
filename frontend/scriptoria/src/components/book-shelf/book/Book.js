import './Book.css'

const Book = ({data}) => {
    return(
            <div class="book">
                <img src={data.img} alt="Book cover"/>
            </div>
    );
}

export default Book;
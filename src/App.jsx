import { useState } from "react";
import "./App.css";
import Swal from "sweetalert2";

const listItem = [
    {
        id: 1,
        title: "Makan",
        done: false,
    },
    {
        id: 2,
        title: "Tidur",
        done: true,
    },
];

function App() {
    const [listItem, setListItem] = useState([]);
    //handle item
    const handleAddItem = (item) => {
        setListItem((listItems) => [...listItems, item]);
    };

    //handle ceklis
    const handleTogle = (id) => {
        setListItem((items) =>
            items.map((item) =>
                item.id === id ? { ...item, done: !item.done } : item
            )
        );
    };

    //handle delete
    const handleDelete = (id) => {
        const newItems = listItem.filter((item) => item.id !== id);
        setListItem(newItems);
    };
    //handle clear
    const handleClear = async () => {
        if (listItem.length === 0) {
            Swal.fire("Data tidak ditemukan");
            return;
        }
        const result = await Swal.fire({
            title: "CONFIRM",
            text: "Are you sure you want to clear this list item",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        });

        if (result.isConfirmed) setListItem([]);
    };

    return (
        <div className="app">
            <Logo />
            <Form onAddItem={handleAddItem} />
            <CheckList
                items={listItem}
                onTogle={handleTogle}
                onDelete={handleDelete}
                onClear={handleClear}
            />
            <Stats />
        </div>
    );
}

const Logo = () => {
    return <span className="logo">Gocheck✅</span>;
};

const Form = ({ onAddItem }) => {
    const [title, setTitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            title,
            done: false,
        };
        if (!title) return;
        onAddItem(newItem);

        setTitle("");
    };
    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <h3>Ada yang mau kamu catat?</h3>
            <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button>Add</button>
        </form>
    );
};

const CheckList = ({ items, onTogle, onDelete, onClear }) => {
    const [sortBy, setSortBy] = useState("input");

    const sortItems = () => {
        switch (sortBy) {
            case "title":
                return items
                    .slice()
                    .sort((a, b) => a.title.localeCompare(b.title));
            case "status":
                return items
                    .slice()
                    .sort((a, b) => Number(a.done) - Number(b.done));
            case "input":
            default:
                return items;
        }
    };
    //perlu dibuat variabel untuk dilakukan mapping
    const sortedItems = sortItems();
    return (
        <div className="list">
            <ul>
                {sortedItems.map((item) => (
                    <Item
                        item={item}
                        key={item.id}
                        onTogle={onTogle}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
            <div className="actions">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="input">Urutkan berdasarkan input</option>
                    <option value="title">Urutkan berdasarkan judul</option>
                    <option value="status">Urutkan berdasarkan status</option>
                </select>
                <button onClick={onClear}>Hapus</button>
            </div>
        </div>
    );
};

const Item = ({ item, onTogle, onDelete }) => {
    return (
        <li>
            <input
                type="checkbox"
                name={item.title}
                value={item.done}
                onChange={() => onTogle(item.id)}
            />
            <span style={{ textDecoration: item.done ? "line-through" : "" }}>
                {item.title}
            </span>
            <button onClick={() => onDelete(item.id)}>❌</button>
        </li>
    );
};

const Stats = () => {
    return <div className="stats">apakah anda puas dengan hari ini</div>;
};

export default App;

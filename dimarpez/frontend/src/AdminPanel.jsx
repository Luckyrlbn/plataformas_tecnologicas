import { useEffect, useState } from "react"

const API = import.meta.env.VITE_API_URL + "/api"

export default function AdminPanel() {

    const [productos, setProductos] = useState([])

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        precio: "",
        stock: ""
    })

    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {

        if (user?.rol !== "admin") {
            window.location.href = "/"
        }

        cargarProductos()

    }, [])

    const cargarProductos = async () => {

        const res = await fetch(`${API}/producto`)
        const data = await res.json()

        setProductos(data)
    }

    const crearProducto = async () => {

        await fetch(`${API}/producto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoProducto)
        })

        cargarProductos()
    }

    const eliminarProducto = async (id) => {

        await fetch(`${API}/producto/${id}`, {
            method: "DELETE"
        })

        cargarProductos()
    }

    return (
        <div style={{padding: 20}}>

            <h1>Panel Admin</h1>

            <div>

                <input
                    placeholder="Nombre"
                    onChange={(e) =>
                        setNuevoProducto({
                            ...nuevoProducto,
                            nombre: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Precio"
                    onChange={(e) =>
                        setNuevoProducto({
                            ...nuevoProducto,
                            precio: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Stock"
                    onChange={(e) =>
                        setNuevoProducto({
                            ...nuevoProducto,
                            stock: e.target.value
                        })
                    }
                />

                <button onClick={crearProducto}>
                    Crear Producto
                </button>

            </div>

            <hr />

            {productos.map((producto) => (

                <div key={producto.id}>

                    <h3>{producto.nombre}</h3>

                    <p>${producto.precio}</p>

                    <p>Stock: {producto.stock}</p>

                    <button
                        onClick={() =>
                            eliminarProducto(producto.id)
                        }
                    >
                        Eliminar
                    </button>

                    <hr />

                </div>

            ))}

        </div>
    )
}

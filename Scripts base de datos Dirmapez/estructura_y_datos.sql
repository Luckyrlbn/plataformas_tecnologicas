-- ==================== ELIMINAR TABLAS EXISTENTES ====================
DROP TABLE IF EXISTS items_pedido CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS perfiles CASCADE;

-- ==================== CREACIÓN DE TABLAS ====================
CREATE TABLE perfiles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    alias VARCHAR(100),
    direccion VARCHAR(100),
    metodo_pago VARCHAR(100),
    rol VARCHAR(100) NOT NULL DEFAULT 'cliente',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE productos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    unidad VARCHAR(100),
    emoji VARCHAR(100),
    categoria VARCHAR(100),
    stock NUMERIC NOT NULL DEFAULT 0 CHECK (stock >= 0),
    activo CHAR(1) NOT NULL DEFAULT 'S' CHECK (activo IN ('S','N')),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pedidos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    alias VARCHAR(100),
    direccion VARCHAR(100),
    metodo_pago VARCHAR(100),
    nota TEXT,
    total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    estado VARCHAR(100) NOT NULL DEFAULT 'pendiente',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    perfiles_id INTEGER NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT
);

CREATE TABLE items_pedido (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_unit NUMERIC(10,2) NOT NULL CHECK (precio_unit >= 0),
    cantidad_kg NUMERIC(10,2) NOT NULL CHECK (cantidad_kg > 0),
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    pedidos_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    productos_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT
);

-- ==================== INSERCIÓN DE DATOS DE PRUEBA ====================

-- Perfiles
INSERT INTO perfiles (nombre, alias, direccion, metodo_pago, rol)
VALUES 
    ('Carlos Martínez', 'Charlie', 'Calle 123 #45-67', 'Efectivo', 'cliente'),
    ('María López', 'Mary', 'Carrera 8 #12-34', 'Tarjeta', 'admin'),
    ('Pedro Ramírez', 'Pedrito', 'Avenida Siempre Viva 742', 'Transferencia', 'repartidor');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, unidad, emoji, categoria, stock, activo)
VALUES
    ('Manzana Roja', 'Manzana fresca importada', 2500.00, 'kg', '🍎', 'Frutas', 50, 'S'),
    ('Leche Entera', 'Leche entera 1 litro', 3200.00, 'unidad', '🥛', 'Lácteos', 30, 'S'),
    ('Pan Integral', 'Pan integral grande', 1800.00, 'unidad', '🍞', 'Panadería', 20, 'S'),
    ('Arroz Premium', 'Arroz blanco 1 kg', 4200.00, 'kg', '🍚', 'Granos', 100, 'S'),
    ('Aguacate Hass', 'Aguacate maduro', 3500.00, 'kg', '🥑', 'Frutas', 15, 'S');

-- Pedidos
INSERT INTO pedidos (codigo, nombre, alias, direccion, metodo_pago, nota, total, estado, perfiles_id)
VALUES
    ('PED-2024-0001', 'Carlos Martínez', 'Charlie', 'Calle 123 #45-67', 'Efectivo', 'Dejar en la puerta', 5000.00, 'pendiente', 1),
    ('PED-2024-0002', 'María López', 'Mary', 'Carrera 8 #12-34', 'Tarjeta', 'Sin cebolla', 7400.00, 'confirmado', 2);

-- Ítems de pedido (por cada pedido)
-- Pedido 1: 2 kg de Manzana Roja
INSERT INTO items_pedido (nombre, precio_unit, cantidad_kg, subtotal, pedidos_id, productos_id)
VALUES ('Manzana Roja', 2500.00, 2.0, 5000.00, 1, 1);

-- Pedido 2: 1 Leche y 2 Pan Integral
INSERT INTO items_pedido (nombre, precio_unit, cantidad_kg, subtotal, pedidos_id, productos_id)
VALUES 
    ('Leche Entera', 3200.00, 1.0, 3200.00, 2, 2),
    ('Pan Integral', 1800.00, 2.0, 3600.00, 2, 3);
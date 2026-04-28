-- ============================================================
-- CONSULTA #1
-- Verifica que existan los tres perfiles del sistema: cliente,
-- administrador y repartidor, mostrando sus datos básicos.
-- ============================================================
SELECT id, nombre, alias, rol, creado_en
FROM perfiles;

-- ============================================================
-- CONSULTA #2
-- Filtra productos activos (activo = 'S', columna CHAR(1)) y con
-- stock positivo, demostrando la restricción CHECK (stock >= 0)
-- que impide valores negativos.
-- ============================================================
SELECT id, nombre, precio, stock, unidad, categoria
FROM productos
WHERE activo = 'S' AND stock > 0;

-- ============================================================
-- CONSULTA #3
-- Obtiene todos los pedidos con información resumida: código,
-- estado, total y el nombre del cliente, uniendo con la tabla
-- de perfiles mediante la clave foránea perfiles_id.
-- ============================================================
SELECT p.id, p.codigo, p.estado, p.total, f.nombre AS cliente
FROM pedidos p
JOIN perfiles f ON p.perfiles_id = f.id;

-- ============================================================
-- CONSULTA #4
-- Desglose detallado de los ítems del pedido con id = 2.
-- Une items_pedido con productos para mostrar nombre, cantidad,
-- precio unitario, subtotal y atributos del producto (emoji,
-- categoría).
-- ============================================================
SELECT ip.pedidos_id, ip.nombre AS producto, ip.cantidad_kg, ip.precio_unit, ip.subtotal,
       pr.emoji, pr.categoria
FROM items_pedido ip
JOIN productos pr ON ip.productos_id = pr.id
WHERE ip.pedidos_id = 2;

-- ============================================================
-- CONSULTA #5
-- Agrupación de pedidos por estado: cuenta cuántos pedidos hay
-- en cada estado y suma los totales de esos pedidos.
-- ============================================================
SELECT estado, COUNT(*) AS cantidad, SUM(total) AS suma_total
FROM pedidos
GROUP BY estado;

-- ============================================================
-- CONSULTA #6
-- Busca todos los pedidos realizados por el cliente con alias
-- 'Charlie', mostrando código, estado, total y fecha de creación.
-- ============================================================
SELECT p.codigo, p.estado, p.total, p.creado_en
FROM pedidos p
JOIN perfiles f ON p.perfiles_id = f.id
WHERE f.alias = 'Charlie';

-- ============================================================
-- CONSULTA #7
-- Actualiza el estado de un pedido específico (código único) a
-- 'confirmado'. Luego se consulta la misma fila para verificar
-- que el cambio se aplicó correctamente.
-- ============================================================
UPDATE pedidos
SET estado = 'confirmado'
WHERE codigo = 'PED-2024-0001';

-- Confirmación del cambio
SELECT * FROM pedidos WHERE codigo = 'PED-2024-0001';

-- ============================================================
-- CONSULTA #8
-- Inserta un nuevo producto 'Queso Mozzarella' con todos sus
-- datos. La columna 'activo' se establece en 'S' y el stock en
-- 25, respetando la restricción CHECK (stock >= 0). Finalmente
-- se verifica la inserción.
-- ============================================================
INSERT INTO productos (nombre, descripcion, precio, unidad, emoji, categoria, stock, activo)
VALUES ('Queso Mozzarella', 'Queso fresco 500g', 6500.00, 'unidad', '🧀', 'Lácteos', 25, 'S');

SELECT * FROM productos WHERE nombre = 'Queso Mozzarella';

-- ============================================================
-- CONSULTA #9
-- Elimina un ítem específico (id = 3) del pedido 2. Luego se
-- comprueba que el pedido padre (id = 2) sigue existiendo,
-- demostrando que la eliminación no afecta la integridad del
-- pedido principal (relación muchos a uno).
-- ============================================================
DELETE FROM items_pedido WHERE id = 3;  -- Pan Integral en pedido 2

SELECT * FROM pedidos WHERE id = 2;

-- ============================================================
-- CONSULTA #10
-- Intenta insertar un pedido con perfiles_id = 999, un valor que
-- no existe en la tabla perfiles. Esto debería fallar si la
-- restricción de clave foránea está activa, demostrando así la
-- integridad referencial entre pedidos y perfiles.
-- ============================================================
INSERT INTO pedidos (codigo, nombre, alias, direccion, metodo_pago, nota, total, estado, perfiles_id)
VALUES ('PED-2024-0003', 'Invitado', 'Ghost', 'Calle Falsa 123', 'Efectivo', '', 0.00, 'pendiente', 999);
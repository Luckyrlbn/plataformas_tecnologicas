// Simulación de base de datos de productos
export const PRODUCTS = [
  { id:1, nombre:"Tilapia Roja", emoji:"🐟", categoria:"Pescado", descripcion:"Fresca del día, ideal para hervir o freír. Sabor suave y textura firme.", precio:18000, stock:40, unidad:"kg", activo:true },
  { id:2, nombre:"Bocachico", emoji:"🐠", categoria:"Pescado", descripcion:"Típico de la región, perfecto para sancocho o frito. Muy popular en la costa.", precio:22000, stock:25, unidad:"kg", activo:true },
  { id:3, nombre:"Camarón Tigre", emoji:"🦐", categoria:"Mariscos", descripcion:"Camarón grande y jugoso. Ideal para cócteles, pastas y parrilladas.", precio:45000, stock:15, unidad:"kg", activo:true },
  { id:4, nombre:"Mojarra Plateada", emoji:"🐡", categoria:"Pescado", descripcion:"Deliciosa a la plancha o en caldo. Piel plateada característica.", precio:20000, stock:30, unidad:"kg", activo:true },
  { id:5, nombre:"Calamar", emoji:"🦑", categoria:"Mariscos", descripcion:"Fresquísimo, perfecto para anillos fritos o arroces marineros.", precio:38000, stock:10, unidad:"kg", activo:true },
  { id:6, nombre:"Trucha Arcoíris", emoji:"🎣", categoria:"Pescado", descripcion:"Criada en agua fría de río. Carne rosada y sabor delicado.", precio:28000, stock:20, unidad:"kg", activo:true },
  { id:7, nombre:"Pulpo", emoji:"🐙", categoria:"Mariscos", descripcion:"Limpio y listo para cocinar. Ideal para preparaciones gourmet.", precio:55000, stock:8, unidad:"kg", activo:true },
  { id:8, nombre:"Bagre", emoji:"🐟", categoria:"Pescado", descripcion:"Pescado de río resistente con mucho sabor. Tradicional en sopas.", precio:16000, stock:35, unidad:"kg", activo:true },
];

export const WEIGHT_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];
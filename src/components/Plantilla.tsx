interface PlantillaProps {
    nombre: string;
    lugar: string;
    imagen: string;
    link: string;
}

export const Plantilla = ({ nombre, lugar, imagen, link }: PlantillaProps) => {
    return (
        <div className = 'plantilla'>
            <h1>{nombre}</h1>
            <h2>{lugar}</h2>
            <a href={link} target="_blank"><img src={imagen} alt={nombre} /></a>
        </div>
    )
}
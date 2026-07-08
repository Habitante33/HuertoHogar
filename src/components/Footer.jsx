import React from 'react';

export default function Footer() {
    return (
        <footer className="footer-hh py-4 mt-5">
            <div className="container text-center">
                <img 
                    src="/src/assets/imagenes/logoHuerto.jpeg" 
                    alt="Logo HuertoHogar" 
                    style={{ height: '50px', borderRadius: '8px', marginBottom: '10px', objectFit: 'cover' }} 
                />
                <p className="mb-1 fw-bold text-dark">HuertoHogar Chile</p>
                <p className="small mb-1 fst-italic">Conéctate con la naturaleza y lleva lo mejor del campo a tu mesa.</p>
                <p className="small mb-3 fw-bold text-dark">¡Únete a nosotros y disfruta de productos frescos y saludables, directo a tu hogar!</p>
                <div className="d-flex justify-content-center gap-3 mb-3 fs-5">
                    <a href="#" className="text-success"><i className="fa-brands fa-facebook"></i></a>
                    <a href="#" className="text-success"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#" className="text-success"><i className="fa-brands fa-whatsapp"></i></a>
                </div>
                <p className="small text-muted mb-0">derechos reservados © 2026 HuertoHogar</p>
            </div>
        </footer>
    );
}

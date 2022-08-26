import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // correo
      pass: process.env.EMAIL_PASS  
    }
  });

  const info = await transport.sendMail({
    from: '"One Greety" <cuentas@onegreety.com>',
    to: email, 
    subject: 'Confirmar Cuenta',
    text: "Confirma tu cuenta en One Greety",
    html: `
            <h1>Hola ${nombre}</h1>
            <p>Para confirmar tu cuenta, haz click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Confirmar Cuenta </a>
            <p>Si no has hecho ninguna petición, puedes ignorar este correo.</p>
          `
  }); 
}

export const emailRecuperarPassword = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const info = await transport.sendMail({
    from: '"One Greety" <cuentas@onegreety.com>',
    to: email, 
    subject: 'Recuperar Contraseña',
    text: "Solicitud de recuperación de contraseña en One Greety",
    html: `
            <h1>Hola ${nombre}</h1>
            <p>Para restablecer tu contraseña haz click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}"> Restablecer contraseña </a>
            <p>Si no has hecho ninguna petición, puedes ignorar este correo.</p>
          `
  }); 
}
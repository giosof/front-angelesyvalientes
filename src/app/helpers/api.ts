//const BASE_URL = 'https://api-angelesyvalientes-latest.onrender.com/api';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer';

export const apiFetch = async (
    endpoint: string,
    options: RequestInit = {},
    responseType: ResponseType = 'json'
  ) => {
    try {
      const token = sessionStorage.getItem('token');
  
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      };
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Token inválido o expirado, eliminarlo de sesión
        sessionStorage.removeItem('token');
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      }
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      switch (responseType) {
        case 'text':
          return await response.text();
        case 'blob':
          return await response.blob();
        case 'arrayBuffer':
          return await response.arrayBuffer();
        default:
          return await response.json();
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

export const loginUser = async (username: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cdUsuario: username, txContrasena: password }),
      });
  
      if (!response.ok) {
        return { ok: false, error: 'Usuario o contraseña incorrectos' };
      }
  
      const token = await response.text();
  
      // Guardar token en sessionStorage
      sessionStorage.setItem('token', token);
  
      return { ok: true, token };
    } catch (error) {
      console.error('Error al hacer login:', error);
      return { ok: false, error: 'Error de conexión con el servidor' };
    }
}

{/* Servicios de /personas */} 
  
export const fetchPeopleList = async () => {
  try {
    const result = await apiFetch('/personas');
    return result;
  } catch (error) {
    console.error('Error al obtener lista de personas:', error);
    return null;
  }
} 

export const fetchPersonInfo = async (idPersona: string) => {
  try {
    const result = await apiFetch(`/personas/${idPersona}`);
    return result;
  } catch (error) {
    console.error('Error al obtener la información de la persona:', error);
    return null;
  }
}

export const savePersona = async (formData: FormData) => {
  try {
    const idPersona = formData.get('idPersona')

    const result = await apiFetch(`/personas${idPersona ? '/' + idPersona : ''}`, {
      method: idPersona ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        {
          "tipoIdentificacion" : {
            "nmTipoIdentificacion" : formData.get('tipoIdentificacion'),
          },
          "txNumeroIdentificacion" : formData.get('txNumeroIdentificacion'),
          "genero": {
            "nmIdGenero": formData.get('genero')
          },
          "txPrimerNombre": formData.get('txPrimerNombre'),
          "txSegundoNombre": formData.get('txSegundoNombre'),
          "txPrimerApellido": formData.get('txPrimerApellido'),
          "txSegundoApellido": formData.get('txSegundoApellido'),
          "txTelefono": formData.get('txTelefono'),
          "txCorreo": formData.get('txCorreo')

        })
    });
    return result;
  } catch (error) {
    console.error('Error al guardar persona:', error);
    return JSON.stringify(
      {
        "error" : error
      });
  }
}

export const fetchTiposIdentificacion = async () => {
  try {
    const result = await apiFetch('/tipos-identificacion');
    return result;
  } catch (error) {
    console.error('Error al obtener listado de tipos de identificacion:', error);
    return null;
  }
} 

export const fetchGeneros = async () => {
  try {
    const result = await apiFetch('/generos');
    return result;
  } catch (error) {
    console.error('Error al obtener listado de generos:', error);
    return null;
  }
}

export const fetchClasificacionesValiente = async () => {
  try {
    const result = await apiFetch('/clasificaciones-valientes');
    return result;
  } catch (error) {
    console.error('Error al obtener listado de clasificaciones del valiente:', error);
    return null;
  }
}

export const fetchGruposEtnicos = async () => {
  try {
    const result = await apiFetch('/grupos-etnicos');
    return result;
  } catch (error) {
    console.error('Error al obtener listado de grupos étnicos:', error);
    return null;
  }
}

export const uploadToGoogleDrive = async (idPersona: string, file: File, documentType: string) => {
  try {
    if (!(file instanceof File)) {
      console.error('El archivo proporcionado no es un tipo File válido');
      return null;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('idPersona', idPersona);
    formData.append('tipoDocumentacion', documentType);

    const response = await apiFetch('/uploadPdfToGoogleDrive', {
      method: 'POST',
      body: formData,
    });

    return response.urlPdf;
  } catch (error) {
    console.error('Error al subir el archivo a Google Drive:', error);
    return null;
  }
};

export const uploadInformeClinicoPdf = async (idInformeClinico: number, file: File, idPersona: string ) => {
  try {
    if (!(file instanceof File)) {
      console.error('El archivo proporcionado no es un tipo File válido');
      return null;
    }

    const formData = new FormData();
    formData.append('pdf', file); 
    formData.append('idInformeClinico', idInformeClinico.toString());
    formData.append('idPersona', idPersona);

    const response = await apiFetch('/uploadInformeClinicoPdf', {
      method: 'POST',
      body: formData,
    });

    return response.urlPdf;
  } catch (error) {
    console.error('Error al subir el archivo a Google Drive:', error);
    return null;
  }
};

export const saveDocumentacion = async (documentacionData: any) => {
  try {
    const response = await apiFetch('/documentaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentacionData)
    });

    return response;
  } catch (error) {
    console.error('Error al guardar la documentación:', error);
    return null;
  }
};

export const saveEducacion = async (educacionData: any) => {
  try {
    const response = await apiFetch('/educaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(educacionData)
    });

    return response;
  } catch (error) {
    console.error('Error al guardar la educación:', error);
    return null;
  }
};

export const fetchEducacionesByPersona = async (idPersona: string) => {
  try {
    const result = await apiFetch(`/educaciones/persona/${idPersona}`);
    return result;
  } catch (error) {
    console.error('Error al obtener las educaciones de la persona:', error);
    return null;
  }
};

export const fetchDocumentacionesByPersona = async (idPersona: string) => {
  try {
    const result = await apiFetch(`/documentaciones/persona/${idPersona}`);
    return result;
  } catch (error) {
    console.error('Error al obtener las documentaciones de la persona:', error);
    return null;
  }
};

export const saveInformesClinicos = async (clinicoData: any) => {
  try {
    const response = await apiFetch('/informesclinicos', {
      method: 'POST',
      body: JSON.stringify(clinicoData),
      headers: { 'Content-Type': 'application/json' }
    });

    return response;
  } catch (error) {
    console.error('Error al guardar la documentación:', error);
    return null;
  }
};

export const fetchClinicosByPersona = async (idPersona: string) => {
  try {
    const result = await apiFetch(`/informesclinicos/persona/${idPersona}`);
    return result;
  } catch (error) {
    console.error('Error al obtener las educaciones de la persona:', error);
    return null;
  }
};
  
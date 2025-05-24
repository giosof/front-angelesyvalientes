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

      if (response.status == 402) {
        // Token inválido o expirado, eliminarlo de sesión
        sessionStorage.removeItem('token');
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      }
  
      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text(); 
        } catch (e) {
          errorText = `Error ${response.status}: ${response.statusText}`; 
        }
        throw new Error(errorText); 
      }
  
      let data: any; 
      switch (responseType) {
        case 'text':
          data = await response.text();
          break;
        case 'blob':
          data = await response.blob();
          break;
        case 'arrayBuffer':
          data = await response.arrayBuffer();
          break;
        default:
          data = await response.json();
          break;
      }
      return data;
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


export const saveDocumentacion = async (documentacionData: any, file: File) => {
  try {
    const formData = new FormData();
    formData.append('archivoInforme', file, file.name);
    formData.append('documentacion', new Blob([JSON.stringify(documentacionData)], { type: 'application/json' }));

    const response = await apiFetch('/documentaciones', {
      method: 'POST',
      body: formData
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

export const saveInformesClinicos = async (clinicoData: any, file: File) => {
  try {
    if (!(file instanceof File)) {
      console.error('El archivo proporcionado no es un tipo File válido');
      return null;
    }

    const formData = new FormData();
    formData.append('archivoInforme', file, file.name);
    formData.append('informeClinico', new Blob([JSON.stringify(clinicoData)], { type: 'application/json' }));

    const response = await apiFetch('/informesclinicos', {
      method: 'POST',
      body: formData,
    });

    return response.ok;
  } catch (error) {
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

export const saveVivienda = async (viviendaData: any) => {
  try {
    const response = await apiFetch('/viviendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(viviendaData)
    });

    return response;
  } catch (error) {
    console.error('Error al guardar la vivienda:', error);
    return null;
  }
};

export const fetchProgramas = async () => {
  try {
    const result = await apiFetch('/programas');
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de programas:', error);
    return null;
  }
}

export const saveMatriculaValiente = async (idPersona: string, idPrograma: string) => {
  try {
    const response = await apiFetch(`/fichas-por-valiente/crear?idPersona=${idPersona}&idPrograma=${idPrograma}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response;
  } catch (error) {
    console.error('Error al guardar la matrícula del valiente:', error);
    return null;
  }
};

export const savePrograma = async (programaData: any) => {
  try {
    const response = await apiFetch('/programas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(programaData)
    });
    return response;
  } catch (error) {
    console.error('Error al guardar el programa:', error);
    return null;
  }
};

export const saveFicha = async (fichaData: any, archivo: File) => {
    try {
        console.log("fichaData", fichaData);
        const formData = new FormData();
        formData.append('archivoRecurso', archivo);
        formData.append('ficha', new Blob([JSON.stringify(fichaData)], { type: 'application/json' }));

        const response = await apiFetch('/fichas', {
            method: 'POST',
            body: formData
        });
        return response;
    } catch (error) {
        console.error('Error al guardar la ficha:', error);
        return null;
    }
};

export const fetchProgramasByValiente = async (idPersona: string) => {
  try {
    const result = await apiFetch(`/fichas-por-valiente/${idPersona}/programas`);
    return result;
  } catch (error) {
    console.error('Error al obtener los programas del valiente:', error);
    return null;
  }
};

export const fetchFichasByProgramaAndPersona = async (idPrograma: string, idPersona: string) => {
  try {
    const result = await apiFetch(`/fichas-por-valiente/programas/${idPrograma}/personas/${idPersona}/fichas`);
    return result;
  } catch (error) {
    console.error('Error al obtener las fichas del programa:', error);
    return null;
  }
};

export const completarClase = async (idFicha: string, idValiente: string, fechaFinalizacion: string) => {
  try {
    const response = await apiFetch(`/fichas-por-valiente/${idFicha}/${idValiente}?fechaFinalizacion=${fechaFinalizacion}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    return response;
  } catch (error) {
    console.error('Error al completar la clase:', error);
    return null;
  }
};

export const fetchFichasByPrograma = async (idPrograma: string) => {
  try {
    const result = await apiFetch(`/fichas/por-programa/${idPrograma}`);
    return result;
  } catch (error) {
    console.error('Error al obtener las fichas del programa:', error);
    return null;
  }
};

export const fetchReporteClasesPorPrograma = async (idPrograma: string) => {
  try {
    const result = await apiFetch(`/fichas-por-valiente/valientes/programa/${idPrograma}`);
    return result;
  } catch (error) {
    console.error('Error al obtener el reporte de clases:', error);
    return null;
  }
};

export const saveDonacion = async (personId: string, donacion: {
    idDonacion: number;
    tipoDonacion: {
        id: number;
        tipoDonacion: string;
    };
    fecha: string;
    observacion: string;
}) => {
    try {
        const response = await apiFetch(`/donaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...donacion,
                idPersona: personId
            }),
        });

        if (!response.ok) {
            throw new Error('Error al guardar la donación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
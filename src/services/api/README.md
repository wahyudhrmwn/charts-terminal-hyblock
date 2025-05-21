# API Client (Axios)

Modul ini menyediakan fungsi untuk menangani request ke API menggunakan Axios. Dirancang untuk mempermudah penggunaan API dalam aplikasi front-end.

## Struktur

- `config.ts` - Konfigurasi Axios dan interceptors
- `client.ts` - Implementasi utama API client dengan Axios
- `index.ts` - File untuk re-export fungsi-fungsi API
- `example-api.ts` - Contoh implementasi endpoint API tertentu

## Penggunaan Dasar

### Mengimpor fungsi API

```typescript
import { get, post, put, patch, del } from '@/services/api';
```

### Melakukan Request GET

```typescript
import { get } from '@/services/api';

type ResponseData = {
  id: number;
  name: string;
};

const fetchData = async () => {
  const response = await get<ResponseData>('/api/resource');
  
  if (response.error) {
    console.error('Error:', response.error);
    return;
  }
  
  console.log('Data:', response.data);
};
```

### Melakukan Request GET dengan Parameter

```typescript
import { get } from '@/services/api';

const fetchWithParams = async () => {
  const response = await get<ResponseData>('/api/resource', { 
    page: 1, 
    limit: 10,
    sort: 'name'
  });
  
  if (response.error) {
    console.error('Error:', response.error);
    return;
  }
  
  console.log('Data:', response.data);
};
```

### Melakukan Request POST

```typescript
import { post } from '@/services/api';

type RequestData = {
  name: string;
  email: string;
};

type ResponseData = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

const createData = async (data: RequestData) => {
  const response = await post<ResponseData, RequestData>('/api/resource', data);
  
  if (response.error) {
    console.error('Error:', response.error);
    return;
  }
  
  console.log('Created:', response.data);
};
```

### Menggunakan API yang Sudah Siap

```typescript
import { getUserById, createUser } from '@/services/api/example-api';

// Mendapatkan detail user
const fetchUser = async (id: number) => {
  const response = await getUserById(id);
  
  if (response.error) {
    console.error('Error:', response.error);
    return;
  }
  
  console.log('User:', response.data);
};

// Membuat user baru
const saveUser = async () => {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  };
  
  const response = await createUser(userData);
  
  if (response.error) {
    console.error('Error:', response.error);
    return;
  }
  
  console.log('Created user:', response.data);
};
```

### Menggunakan Axios Instance Langsung

Jika Anda membutuhkan lebih banyak kontrol, Anda dapat menggunakan instance Axios langsung:

```typescript
import { axiosInstance } from '@/services/api';

const customRequest = async () => {
  try {
    const response = await axiosInstance.get('/custom/endpoint', {
      headers: {
        'Custom-Header': 'nilai-kustom'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

## Konfigurasi

Anda dapat mengubah konfigurasi API di file `config.ts`:

- `API_BASE_URL` - URL dasar untuk API
- `DEFAULT_REQUEST_CONFIG` - Konfigurasi default untuk Axios
- `axiosInstance` - Instance Axios yang sudah dikonfigurasi

## Fitur Utama

- Timeout otomatis menggunakan konfigurasi Axios
- Interceptors untuk request dan response
- Penanganan error yang konsisten
- Tipe data yang aman dengan TypeScript generics
- Helper function untuk metode HTTP standar (GET, POST, PUT, PATCH, DELETE)
- Kemampuan untuk menggunakan URL penuh atau endpoint relatif 
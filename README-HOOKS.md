# Hooks Personalizados para StudyIA

Este documento describe los hooks personalizados desarrollados para la aplicación StudyIA, explicando su uso, parámetros y ejemplos de implementación.

## Índice

1. [useLocalStorage](#uselocalstorage) - Gestión tipada de localStorage
2. [useOfflineSync](#useofflinesync) - Sincronización de acciones offline
3. [useForm](#useform) - Gestión de formularios con validación
4. [useKeyPress](#usekeypress) - Detección de pulsaciones de teclas
5. [useModalNavigation](#usemodalnavigation) - Navegación modal con gestión de rutas
6. [useInfiniteScroll](#useinfinitescroll) - Implementación de scroll infinito

## useLocalStorage

Hook para la gestión tipada de datos en localStorage, manteniendo sincronizado el estado de React con el almacenamiento local.

### Uso

```tsx
import { useLocalStorage } from '../hooks/shared/useLocalStorage';

function UserPreferences() {
  const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  
  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Cambiar tema
      </button>
      <button onClick={removeTheme}>Restablecer tema</button>
    </div>
  );
}
```

### Versión sin estado

También se proporciona una versión sin estado que no mantiene los valores en el estado de React:

```tsx
import { useLocalStorageValue } from '../hooks/shared/useLocalStorage';

function CacheManager() {
  const { getValue, setValue, removeValue } = useLocalStorageValue<string[]>('recent-searches');
  
  const clearSearches = () => {
    removeValue();
    // No requiere re-renderizado
  };
  
  return (
    <button onClick={clearSearches}>Limpiar búsquedas recientes</button>
  );
}
```

## useOfflineSync

Hook para gestionar la sincronización de acciones offline, almacenando operaciones cuando el usuario está sin conexión y ejecutándolas cuando la conexión se restablece.

### Uso

```tsx
import { useOfflineSync } from '../hooks/shared/useOfflineSync';

function NoteEditor() {
  // Función que sincroniza las acciones pendientes
  const syncNotes = async (actions) => {
    const successfulIds = [];
    
    for (const action of actions) {
      try {
        if (action.action === 'create') {
          await api.notes.create(action.payload);
        } else if (action.action === 'update') {
          await api.notes.update(action.payload.id, action.payload);
        }
        successfulIds.push(action.id);
      } catch (error) {
        console.error('Error sincronizando nota:', error);
      }
    }
    
    return successfulIds;
  };
  
  const {
    isOnline,
    isSyncing,
    pendingActions,
    addPendingAction,
    synchronize,
    pendingActionsCount
  } = useOfflineSync('offline-notes', syncNotes);
  
  const saveNote = (note) => {
    if (isOnline) {
      // Guardar directamente
      api.notes.update(note.id, note);
    } else {
      // Guardar para sincronización posterior
      addPendingAction('update', note);
    }
  };
  
  return (
    <div>
      {!isOnline && <div>Modo sin conexión ({pendingActionsCount} cambios pendientes)</div>}
      {isSyncing && <div>Sincronizando...</div>}
      <button onClick={() => saveNote(currentNote)}>Guardar nota</button>
      {pendingActionsCount > 0 && isOnline && (
        <button onClick={synchronize}>Sincronizar ahora</button>
      )}
    </div>
  );
}
```

## useForm

Hook para la gestión de formularios con validación de campos.

### Uso

```tsx
import { useForm } from '../hooks/shared/useForm';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

function LoginPage() {
  // Definir validadores
  const validators = {
    email: (value: string) => {
      if (!value) return 'El email es obligatorio';
      if (!value.includes('@')) return 'Email no válido';
      return null;
    },
    password: (value: string) => {
      if (!value) return 'La contraseña es obligatoria';
      if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
      return null;
    }
  };
  
  // Inicializar el formulario
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    setTouched
  } = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
      remember: false
    },
    validators,
    onSubmit: async (values) => {
      try {
        await api.auth.login(values);
        // Redireccionar o actualizar estado
      } catch (error) {
        // Manejar error
      }
    }
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={() => setTouched('email')}
        />
        {touched.email && errors.email && <div>{errors.email}</div>}
      </div>
      
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={() => setTouched('password')}
        />
        {touched.password && errors.password && <div>{errors.password}</div>}
      </div>
      
      <div>
        <label>
          <input
            name="remember"
            type="checkbox"
            checked={values.remember}
            onChange={handleChange}
          />
          Recordarme
        </label>
      </div>
      
      <button type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

## useKeyPress

Hook para detectar pulsaciones de teclas específicas y combinaciones de teclas.

### Uso básico

```tsx
import { useKeyPress } from '../hooks/shared/useKeyPress';

function ShortcutComponent() {
  // Detectar cuando se presiona la tecla Escape
  const { pressed } = useKeyPress('Escape', (event) => {
    console.log('Tecla Escape presionada');
  }, {
    preventDefault: true
  });
  
  // También se pueden usar arrays para múltiples teclas
  useKeyPress(['ArrowUp', 'ArrowDown'], (event) => {
    console.log(`Tecla ${event.key} presionada`);
  });
  
  // O una función de filtro personalizada
  useKeyPress(
    (event) => event.key === 'a' && event.ctrlKey,
    () => console.log('Ctrl+A presionado')
  );
  
  return (
    <div>
      {pressed && <div>Escape está siendo presionado</div>}
    </div>
  );
}
```

### Combinaciones de teclas

```tsx
import { useKeyCombination } from '../hooks/shared/useKeyPress';

function HotkeysComponent() {
  // Detectar combinación Ctrl+S
  const isCtrlSSaving = useKeyCombination(['Control', 's'], (event) => {
    console.log('Guardar con Ctrl+S');
    saveDocument();
  });
  
  return (
    <div>
      {isCtrlSSaving && <div>¡Guardando!</div>}
      <p>Presiona Ctrl+S para guardar</p>
    </div>
  );
}
```

## useModalNavigation

Hook para implementar navegación modal con gestión de rutas y parámetros de URL.

### Uso

```tsx
import { useModalNavigation } from '../hooks/shared/useModalNavigation';

// Componente para el modal
function UserDetailModal({ userId, onClose }) {
  return (
    <div className="modal">
      <h2>Detalles del usuario {userId}</h2>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}

// Componente principal
function UsersList() {
  const {
    isModalOpen,
    modalComponent,
    modalOptions,
    openModal,
    openModalRoute,
    closeModal
  } = useModalNavigation();
  
  const showUserDetails = (userId) => {
    // Abrir un componente directamente como modal
    openModal(
      <UserDetailModal userId={userId} onClose={closeModal} />,
      {
        title: `Usuario ${userId}`,
        fullScreen: false,
        closeOnClickOutside: true
      }
    );
  };
  
  const navigateToUserProfile = (userId) => {
    // Navegar a una ruta pero mostrarla como modal
    openModalRoute(`/users/${userId}`, {
      title: `Perfil de usuario ${userId}`,
      position: 'right'
    });
  };
  
  return (
    <div>
      <h1>Lista de usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => showUserDetails(user.id)}>
              Ver detalles
            </button>
            <button onClick={() => navigateToUserProfile(user.id)}>
              Ver perfil
            </button>
          </li>
        ))}
      </ul>
      
      {/* Renderizado condicional del modal */}
      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-header">
            {modalOptions.title && <h3>{modalOptions.title}</h3>}
            <button onClick={closeModal}>×</button>
          </div>
          <div className="modal-content">
            {modalComponent}
          </div>
        </div>
      )}
    </div>
  );
}
```

## useInfiniteScroll

Hook para implementación de scroll infinito compatible con React Query.

### Uso

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInfiniteScroll } from '../hooks/shared/useInfiniteScroll';

function InfinitePostsList() {
  // Consulta de React Query
  const postsQuery = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    }
  });
  
  // Hook de scroll infinito
  const {
    ref,
    loadMore,
    isLoadingMore,
    hasNextPage,
    extractAllItems
  } = useInfiniteScroll(postsQuery, {
    threshold: 300, // Cargar cuando estemos a 300px del final
    onFetchNextPage: () => console.log('Cargando más posts...')
  });
  
  // Extraer todos los posts de todas las páginas
  const allPosts = extractAllItems(postsQuery.data);
  
  return (
    <div>
      <h1>Lista de posts</h1>
      
      {/* Contenedor con referencia para scroll */}
      <div ref={ref} style={{ height: '500px', overflow: 'auto' }}>
        {postsQuery.isLoading ? (
          <p>Cargando posts...</p>
        ) : postsQuery.isError ? (
          <p>Error al cargar los posts</p>
        ) : (
          <>
            <ul>
              {allPosts.map(post => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
            
            {isLoadingMore && <p>Cargando más posts...</p>}
            
            {!isLoadingMore && hasNextPage && (
              <button onClick={loadMore}>Cargar más</button>
            )}
            
            {!hasNextPage && <p>No hay más posts para cargar</p>}
          </>
        )}
      </div>
    </div>
  );
}
``` 
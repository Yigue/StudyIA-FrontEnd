import React, { useState } from 'react';
import { Button, Select, Slider, MultiSelect, Tabs, Card, Tag } from '../../components/ui';
import { BookOpen, ArrowDownUp, Filter, Settings, Brain } from 'lucide-react';
import { StudySessionConfig } from '../../types/flashcards';
import { DifficultyLevel } from '../../types';

interface StudySessionConfigProps {
  defaultConfig: StudySessionConfig;
  availableTags: Array<{id: string, name: string}>;
  onStartSession: (config: StudySessionConfig) => void;
  onCancel: () => void;
}

const DIFFICULTY = {
  easy: 'easy' as DifficultyLevel,
  medium: 'medium' as DifficultyLevel,
  hard: 'hard' as DifficultyLevel
};

const StudySessionConfigScreen: React.FC<StudySessionConfigProps> = ({
  defaultConfig,
  availableTags,
  onStartSession,
  onCancel
}) => {
  const [config, setConfig] = useState<StudySessionConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Actualiza un valor específico de configuración
  const updateConfig = <K extends keyof StudySessionConfig>(key: K, value: StudySessionConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  // Manejador para iniciar la sesión
  const handleStartSession = () => {
    onStartSession(config);
  };
  
  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Configurar Sesión de Estudio
      </h2>
      
      <Tabs 
        tabs={[
          { id: 'basic', label: 'Básico', icon: <BookOpen size={16} /> },
          { id: 'advanced', label: 'Avanzado', icon: <Settings size={16} /> },
          { id: 'algorithm', label: 'Algoritmo', icon: <Brain size={16} /> }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />
      
      <Card className="p-6 mb-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <BookOpen className="mr-2" size={18} />
                Límites de Tarjetas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Tarjetas nuevas por día
                  </label>
                  <div className="flex items-center">
                    <Slider
                      value={config.newCardsPerDay}
                      min={0}
                      max={50}
                      step={5}
                      onChange={(value) => updateConfig('newCardsPerDay', value)}
                      className="flex-1 mr-3"
                    />
                    <span className="font-medium w-10 text-center">{config.newCardsPerDay}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Revisiones máximas por día
                  </label>
                  <div className="flex items-center">
                    <Slider
                      value={config.maxReviewsPerDay}
                      min={0}
                      max={200}
                      step={10}
                      onChange={(value) => updateConfig('maxReviewsPerDay', value)}
                      className="flex-1 mr-3"
                    />
                    <span className="font-medium w-10 text-center">{config.maxReviewsPerDay}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Filter className="mr-2" size={18} />
                Filtros
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Etiquetas a incluir
                  </label>
                  <MultiSelect
                    options={availableTags.map(tag => ({ label: tag.name, value: tag.id }))}
                    value={config.includeTags || []}
                    onChange={(values) => updateConfig('includeTags', values)}
                    placeholder="Seleccionar etiquetas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Etiquetas a excluir
                  </label>
                  <MultiSelect
                    options={availableTags.map(tag => ({ label: tag.name, value: tag.id }))}
                    value={config.excludeTags || []}
                    onChange={(values) => updateConfig('excludeTags', values)}
                    placeholder="Seleccionar etiquetas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Rango de dificultad
                  </label>
                  <div className="flex space-x-2 items-center">
                    <Select
                      options={[
                        { label: 'Fácil', value: DIFFICULTY.easy },
                        { label: 'Media', value: DIFFICULTY.medium },
                        { label: 'Difícil', value: DIFFICULTY.hard }
                      ]}
                      value={config.difficultyRange?.[0] || DIFFICULTY.easy}
                      onChange={(value) => updateConfig('difficultyRange', [value as DifficultyLevel, config.difficultyRange?.[1] || DIFFICULTY.hard])}
                    />
                    <span>a</span>
                    <Select
                      options={[
                        { label: 'Fácil', value: DIFFICULTY.easy },
                        { label: 'Media', value: DIFFICULTY.medium },
                        { label: 'Difícil', value: DIFFICULTY.hard }
                      ]}
                      value={config.difficultyRange?.[1] || DIFFICULTY.hard}
                      onChange={(value) => updateConfig('difficultyRange', [config.difficultyRange?.[0] || DIFFICULTY.easy, value as DifficultyLevel])}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <ArrowDownUp className="mr-2" size={18} />
                Ordenación y Presentación
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Orden de revisión
                  </label>
                  <Select
                    options={[
                      { label: 'Por vencimiento', value: 'due' },
                      { label: 'Por dificultad', value: 'difficulty' },
                      { label: 'Aleatorio', value: 'random' }
                    ]}
                    value={config.reviewOrder}
                    onChange={(value) => updateConfig('reviewOrder', value as 'due' | 'difficulty' | 'random')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Modo de estudio
                  </label>
                  <Select
                    options={[
                      { label: 'Estándar', value: 'standard', description: 'Siguiendo el algoritmo de repetición espaciada' },
                      { label: 'Intensivo', value: 'cram', description: 'Repasar todas las tarjetas seleccionadas' },
                      { label: 'Personalizado', value: 'custom', description: 'Configuración personalizada del algoritmo' }
                    ]}
                    value={config.studyMode}
                    onChange={(value) => updateConfig('studyMode', value as 'standard' | 'cram' | 'custom')}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'algorithm' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Brain className="mr-2" size={18} />
                Ajustes del Algoritmo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Pasos de aprendizaje (minutos)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {config.learningSteps?.map((step, index) => (
                      <Tag 
                        key={index} 
                        variant="outline"
                        onDelete={() => {
                          const newSteps = [...config.learningSteps];
                          newSteps.splice(index, 1);
                          updateConfig('learningSteps', newSteps);
                        }}
                      >
                        {step} min
                      </Tag>
                    ))}
                    <button 
                      className="px-2 py-1 text-xs border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        const newStep = window.prompt('Introduce un nuevo intervalo en minutos:', '10');
                        if (newStep && !isNaN(parseInt(newStep))) {
                          updateConfig('learningSteps', [...(config.learningSteps || []), parseInt(newStep)]);
                        }
                      }}
                    >
                      + Añadir
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Intervalos de tiempo para repasar las nuevas tarjetas antes de programarlas para revisión.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        
        <div className="flex items-center">
          <div className="mr-4 text-sm">
            <div className="font-medium">Total a estudiar: <span className="text-primary-600">{config.newCardsPerDay + Math.min(config.maxReviewsPerDay, 50)}</span></div>
            <div className="text-xs text-gray-500">(estimado)</div>
          </div>
          <Button variant="primary" onClick={handleStartSession}>
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudySessionConfigScreen; 
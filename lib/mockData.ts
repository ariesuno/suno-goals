import { BookData } from '@/types/indicator';

export const mockBookData: BookData = {
  indicators: [
    {
      id: '1',
      name: '(ACV) Indicadores de negócio',
      unit: '%',
      direction: 'up',
      editable: true, // Usuário preenche
      accumulated: {
        meta: 80,
        real: 44,
        percentage: 55,
      },
      months: {
        jan: { meta: 80, real: 80, percentage: 100 },
        feb: { meta: 80, real: 80, percentage: 100 },
        mar: { meta: 80, real: 50, percentage: 63 },
        apr: { meta: 80, real: 33, percentage: 41 },
        may: { meta: 80, real: 50, percentage: 63 },
        jun: { meta: 80, real: 16, percentage: 20 },
        jul: { meta: 80, real: 25, percentage: 31 },
        aug: { meta: 80, real: 28, percentage: 35 },
        sep: { meta: 80, real: 30, percentage: 38 },
        oct: { meta: 80, real: 0, percentage: 0 },
        nov: { meta: 80, real: 0, percentage: 0 },
        dec: { meta: 80, real: 0, percentage: 0 },
      },
    },
    {
      id: '2',
      name: 'Entrega das Squads',
      unit: '#',
      direction: 'up',
      editable: true, // Usuário preenche
      accumulated: {
        meta: 80,
        real: 83,
        percentage: 104,
      },
      months: {
        jan: { meta: 80, real: 75, percentage: 94 },
        feb: { meta: 80, real: 75, percentage: 94 },
        mar: { meta: 80, real: 75, percentage: 94 },
        apr: { meta: 80, real: 75, percentage: 94 },
        may: { meta: 80, real: 75, percentage: 94 },
        jun: { meta: 80, real: 75, percentage: 94 },
        jul: { meta: 80, real: 100, percentage: 125 },
        aug: { meta: 80, real: 100, percentage: 125 },
        sep: { meta: 80, real: 100, percentage: 125 },
        oct: { meta: 80, real: 0, percentage: 0 },
        nov: { meta: 80, real: 0, percentage: 0 },
        dec: { meta: 80, real: 0, percentage: 0 },
      },
    },
    {
      id: '3',
      name: 'Qualidade de entrega',
      unit: '%',
      direction: 'up',
      editable: true, // Usuário preenche
      accumulated: {
        meta: 80,
        real: 83,
        percentage: 104,
      },
      months: {
        jan: { meta: 80, real: 75, percentage: 94 },
        feb: { meta: 80, real: 75, percentage: 94 },
        mar: { meta: 80, real: 75, percentage: 94 },
        apr: { meta: 80, real: 75, percentage: 94 },
        may: { meta: 80, real: 75, percentage: 94 },
        jun: { meta: 80, real: 75, percentage: 94 },
        jul: { meta: 80, real: 100, percentage: 125 },
        aug: { meta: 80, real: 100, percentage: 125 },
        sep: { meta: 80, real: 100, percentage: 125 },
        oct: { meta: 80, real: 0, percentage: 0 },
        nov: { meta: 80, real: 0, percentage: 0 },
        dec: { meta: 80, real: 0, percentage: 0 },
      },
    },
    {
      id: '4',
      name: 'Orçamento',
      unit: 'R$',
      direction: 'down',
      editable: false, // Apenas visualização
      accumulated: {
        meta: 3471797,
        real: 3105005,
        percentage: 89,
      },
      months: {
        jan: { meta: 376551, real: 335434, percentage: 89 },
        feb: { meta: 379143, real: 313440, percentage: 83 },
        mar: { meta: 490173, real: 310173, percentage: 63 },
        apr: { meta: 393284, real: 313912, percentage: 80 },
        may: { meta: 345026, real: 357369, percentage: 104 },
        jun: { meta: 396757, real: 337720, percentage: 85 },
        jul: { meta: 362486, real: 357401, percentage: 99 },
        aug: { meta: 362387, real: 383230, percentage: 106 },
        sep: { meta: 365390, real: 396806, percentage: 108 },
        oct: { meta: 374500, real: 0, percentage: 0 },
        nov: { meta: 358588, real: 0, percentage: 0 },
        dec: { meta: 358774, real: 0, percentage: 0 },
      },
    },
  ],
};


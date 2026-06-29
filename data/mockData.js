export const usuarios = [
  { username: "aluno1", password: "123", tipo: "aluno" },
  { username: "servidor1", password: "123", tipo: "servidor" },
];

export const itensRefeicao = [
  "Arroz Branco",
  "Arroz Integral",
  "Feijão Carioca",
  "Feijão Preto",
  "Frango Grelhado",
  "Frango Assado",
  "Carne de Panela",
  "Iscas de Carne",
  "Feijoada Especial",
  "Omelete de Legumes",
  "Macarrão Espaguete",
  "Farofa Especial",
  "Pure de Batata",
  "Batata Frita",
  "Legumes Cozidos",
  "Couve Refogada",
  "Salada de Alface e Tomate",
  "Salada de Acelga e Beterraba",
  "Suco de Uva",
  "Suco de Laranja",
  "Suco de Maracujá",
  "Café com Leite",
  "Pão Francês com Margarina",
  "Pão de Queijo",
  "Fruta da Estação",
  "Gelatina de Morango",
];

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateMockCardapios() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
  // Calcula quantos dias voltar para chegar na segunda-feira
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);

  const menuTemplate = [
    // Segunda-feira
    {
      offset: 0,
      refeicoes: [
        { tipo: 'Café-da-manhã', itens: ['Café com Leite', 'Pão Francês com Margarina', 'Fruta da Estação'] },
        { tipo: 'Almoço', itens: ['Arroz Branco', 'Feijão Carioca', 'Frango Grelhado', 'Salada de Alface e Tomate', 'Suco de Laranja'] },
        { tipo: 'Jantar', itens: ['Arroz Integral', 'Feijão Preto', 'Omelete de Legumes', 'Couve Refogada', 'Suco de Uva'] },
      ]
    },
    // Terça-feira
    {
      offset: 1,
      refeicoes: [
        { tipo: 'Café-da-manhã', itens: ['Café com Leite', 'Pão de Queijo', 'Fruta da Estação'] },
        { tipo: 'Almoço', itens: ['Arroz Integral', 'Feijão Preto', 'Carne de Panela', 'Pure de Batata', 'Salada de Acelga e Beterraba', 'Suco de Uva'] },
        { tipo: 'Jantar', itens: ['Arroz Branco', 'Feijão Carioca', 'Frango Assado', 'Legumes Cozidos', 'Suco de Maracujá'] },
      ]
    },
    // Quarta-feira
    {
      offset: 2,
      refeicoes: [
        { tipo: 'Café-da-manhã', itens: ['Café com Leite', 'Pão Francês com Margarina', 'Fruta da Estação'] },
        { tipo: 'Almoço', itens: ['Arroz Branco', 'Feijão Carioca', 'Feijoada Especial', 'Farofa Especial', 'Salada de Alface e Tomate', 'Suco de Laranja'] },
        { tipo: 'Jantar', itens: ['Arroz Integral', 'Feijão Preto', 'Iscas de Carne', 'Salada de Acelga e Beterraba', 'Gelatina de Morango'] },
      ]
    },
    // Quinta-feira
    {
      offset: 3,
      refeicoes: [
        { tipo: 'Café-da-manhã', itens: ['Café com Leite', 'Pão de Queijo', 'Fruta da Estação'] },
        { tipo: 'Almoço', itens: ['Arroz Integral', 'Feijão Preto', 'Iscas de Carne', 'Macarrão Espaguete', 'Legumes Cozidos', 'Suco de Uva'] },
        { tipo: 'Jantar', itens: ['Arroz Branco', 'Feijão Carioca', 'Omelete de Legumes', 'Salada de Alface e Tomate', 'Suco de Maracujá'] },
      ]
    },
    // Sexta-feira
    {
      offset: 4,
      refeicoes: [
        { tipo: 'Café-da-manhã', itens: ['Café com Leite', 'Pão Francês com Margarina', 'Fruta da Estação'] },
        { tipo: 'Almoço', itens: ['Arroz Branco', 'Feijão Carioca', 'Frango Grelhado', 'Batata Frita', 'Salada de Alface e Tomate', 'Suco de Laranja'] },
        { tipo: 'Jantar', itens: ['Arroz Integral', 'Feijão Preto', 'Carne de Panela', 'Pure de Batata', 'Salada de Acelga e Beterraba', 'Suco de Uva'] },
      ]
    },
    // Sábado
    {
      offset: 5,
      refeicoes: [
        { tipo: 'Café-da-manhã', itens: ['Café com Leite', 'Pão de Queijo', 'Fruta da Estação'] },
        { tipo: 'Almoço', itens: ['Arroz Branco', 'Feijão Preto', 'Carne de Panela', 'Farofa Especial', 'Salada de Alface e Tomate', 'Suco de Maracujá'] },
        { tipo: 'Jantar', itens: ['Arroz Integral', 'Feijão Carioca', 'Omelete de Legumes', 'Couve Refogada', 'Suco de Laranja'] },
      ]
    },
    // Domingo
    {
      offset: 6,
      refeicoes: [
        { tipo: 'Café-da-manhã', itens: ['Café com Leite', 'Pão Francês com Margarina', 'Fruta da Estação'] },
        { tipo: 'Almoço', itens: ['Arroz Integral', 'Feijão Carioca', 'Frango Assado', 'Pure de Batata', 'Salada de Acelga e Beterraba', 'Suco de Uva'] },
        { tipo: 'Jantar', itens: ['Arroz Branco', 'Feijão Preto', 'Iscas de Carne', 'Legumes Cozidos', 'Suco de Maracujá'] },
      ]
    }
  ];

  const mockCardapios = [];
  let index = 0;

  menuTemplate.forEach((dia) => {
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + dia.offset);
    const dateStr = formatDate(targetDate);

    dia.refeicoes.forEach((refeicao) => {
      mockCardapios.push({
        id: Date.now() + index++, // IDs baseados em timestamp incrementado para garantir unicidade
        data: dateStr,
        tipo: refeicao.tipo,
        itens: refeicao.itens
      });
    });
  });

  return mockCardapios;
}

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const descricao = formData.get('descricao');
    const curriculo = formData.get('curriculo');

    if (!descricao || !curriculo) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiUrl = 'http://localhost:3333/analisar';

    const form = new FormData();
    form.append('descricao', descricao);
    form.append('curriculo', curriculo);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: form
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : 500,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno no servidor'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
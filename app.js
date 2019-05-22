const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: "Item adicionado",
    alertaAtivo: false,
    loaded: false,
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
      .then(response => response.json())
      .then(response => {
        this.produtos = response;
      })
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
      .then(response => response.json())
      .then(response =>{
        this.produto = response;
      })
    },
    fecharModal({target, currentTarget}) {
      if(target === currentTarget)
        this.produto = false;
    },
    clickForaCarrinho({target, currentTarget}) {
      if(target === currentTarget)
        this.carrinhoAtivo = false;
    },
    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    adicionarItem() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco});
      this.alerta(`${nome} adicionado ao carrinho`)
    },
    removerItem(index) {
      this.carrinho.splice(index,1)
    },
    checarLocalStorage() {
      if(window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    compararEstoque() {
      const items = this.carrinho.filter(({id}) => id === this.produto.id);
      this.produto.estoque -= items.length;
    },
    alerta(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500)
    },
    router() {
      const hash = document.location.hash;
      if(hash)
      this.fetchProduto(hash.replace("#", ""));
    }
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if(this.carrinho.length) {
        this.carrinho.forEach(item => {
          total += item.preco;
        })
      }
      return total;
    }
  },
  watch: {
    produto (){
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`)
      if (this.produto) {
        this.compararEstoque();
      }
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  },
  created() {
    this.fetchProdutos()
    this.router()
    this.checarLocalStorage()
  },
  mounted() {
    this.loaded = true;
  }
})
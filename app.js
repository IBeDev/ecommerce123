const { createApp } = Vue;

createApp({
  data() {
    return {
      currentPage: 'home', // Default page
      email: "", // For login form
      password: "", // For login form
      error: "", // For login form error messages
      searchQuery: "", // Search query
      featuredProducts: [
      ],
      cart: [], // Stores items added to the cart
      isLoading: false // For loading state
    };
  },
  computed: {
    // Filter products based on search query
    filteredProducts() {
      return this.featuredProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    // Calculate cart total
    cartTotal() {
      return this.cart.reduce((total, item) => total + item.price, 0).toFixed(2);
    },
    
    // Check if user is logged in
    isLoggedIn() {
      return this.email === "user@example.com" && this.password === "password123";
    }
  },
  methods: {
    // Add a product to the cart
    addToCart(product) {
      if (!this.isLoggedIn) {
        this.currentPage = 'login';
        this.error = "Please login to add items to cart";
        return;
      }
      this.cart.push({...product});
      alert(`Added ${product.name} to cart!`);
    },
    
    // Checkout
    checkout() {
      if (!this.isLoggedIn) {
        this.currentPage = 'login';
        this.error = "Please login to checkout";
        return;
      }
      if (this.cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        alert(`Checkout successful! Total: $${this.cartTotal}`);
        this.cart = [];
        this.isLoading = false;
        this.currentPage = 'home';
      }, 1000);
    },

    Fetch_Products() {
      const API_URL = "http://44.204.97.49:1337/api/products?populate=*";
    
      fetch(API_URL)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          const newProducts = data.data.map(product => ({
            id: product.id,
            name: product.Name,
            price: parseFloat(product.Price.replace('$', '').trim()), // Converts "$ 25.99" → 25.99
            image: product.Image?.[0]?.formats?.medium?.url || product.Image?.[0]?.url || ''
          }));
    
          this.featuredProducts = this.featuredProducts.concat(newProducts);
        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
    },    
    
    // Handle login form submission
    async handleLogin() {
      if (!this.email || !this.password) {
        this.error = "Please fill in all fields.";
        return;
      }
      
      this.isLoading = true;
      this.error = "";
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (this.email === "user@example.com" && this.password === "password123") {
        alert("Login successful!");
        this.error = "";
        this.currentPage = 'home';
      } else {
        this.error = "Invalid email or password.";
      }
      
      this.isLoading = false;
    },
    
    // Remove item from cart
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    
    // Navigation methods
    goToHome() {
      this.currentPage = 'home';
      this.error = "";
    },
    
    goToLogin() {
      this.currentPage = 'login';
      this.error = "";
    },
    
    goToCart() {
      if (!this.isLoggedIn) {
        this.currentPage = 'login';
        this.error = "Please login to view your cart";
        return;
      }
      this.currentPage = 'cart';
    },
    

    // Logout user
    logout() {
      this.email = "";
      this.password = "";
      this.currentPage = 'home';
      this.cart = [];
      alert("Logged out successfully!");
    }
  },
  mounted() {
    this.Fetch_Products();
  }
}).mount("#app");
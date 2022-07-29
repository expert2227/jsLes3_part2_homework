/**
 * 1.добавить корзину на стр, и добавить уже готовое её содержимое на дивах
 *    1.1 toggle add class hidden
 * 2. в каталоге товаров +but add to cart, можно сделать во время рендера товаров на стр
 */

const getRequest = (url) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status == 200) {
          resolve(xhr.responseText);
        } else {
          reject(console.log('Error'));
        }
      }
    };
    xhr.send();
  })
};


class ProductList {
  constructor(container = '.products', api = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses') {
    this.container = document.querySelector(container);
    this.goods = [];
    this.productObjects = [];
    this.api = api;
    this.fetchGoods();
    // this.render();


    // this.getProducts(api)
    //   .then((data) => {
    //     this.goods = data;
    //     this.render();
    //   });
  }


  fetchGoods() {
    getRequest(`${this.api}/catalogData.json`)
      .then((data) => {
        this.goods = JSON.parse(data);
        this.render();
      })
      .catch((err) => {
        console.log('произошла ошибка при загрузке данных')
      });
  }

  // getProducts(url) {
  //   return fetch(`${url}/catalogData.json`)
  //     .then(response => response.json())
  //     .catch(err => console.log(err));
  // }

  render() {
    for (const good of this.goods) {
      const productObject = new ProductItem(good);
      console.log(productObject);
      this.productObjects.push(productObject);

      this.container.insertAdjacentHTML('beforeend', productObject.getHTMLString());
    }
  }
}

class ProductItem {
  constructor(product, img = 'https://via.placeholder.com/200x150') {
    this.id_product = product.id_product;
    this.product_name = product.product_name;
    this.price = product.price;
    this.img = img;
  }

  getHTMLString() {
    return `<div class="product-item" data-id="${this.id_product}">
                  <img src="${this.img}" alt="Some img">
                  <div class="desc">
                      <h3>${this.product_name}</h3>
                      <p>${this.price} \u20bd</p>
                      <button class="buy-btn">Купить</button>
                  </div>
              </div>`;
  }
}



class Basket {
  constructor(btnOnCart = '.btn-cart') {
    this.btnOnCart = document.querySelector(btnOnCart);
    const divProduct = document.querySelectorAll('.buy-btn');
    this.addClickEventProduct(divProduct);
    this.basketOnPage(btnOnCart);

  }

  elemInMasRenderEl(event) {
    console.log(event.path[2].children[1]);
    const prod = event.path[2].children[1];
    new ElementAddInCart(prod);
  }
  basketOnPage(basket) {
    basket.addEventListener('click', (onOff) => {
      // console.dir(onOff);
      let onPage = document.querySelector('.mainCart');
      onPage.classList.toggle('hidden');
    })
  }
  addClickEventProduct(divProduct) {
    divProduct.forEach((elInCart) => {
      elInCart.addEventListener('click', this.elemInMasRenderEl)
    })
  }


}

/**
 * класс товара который проверяет есть ли элемент по которому произошел клик в массиве
 * если есть то мы запускаем метод увеличения кол-ва данного товара в массиве, 
 * а затем снова передаем массив корзине для дальнейшей отрисовки в самой корзине
 */
class ElementAddInCart {
  constructor(prod) {
    const elementInToCart = [];
    if (!(prod in elementInToCart)) {
      elementInToCart.push(prod);
    } else {
      console.log(elementInToCart);
    }
  }
}

new ProductList();

new Basket()

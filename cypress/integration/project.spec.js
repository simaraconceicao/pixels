const WHITE = 'rgb(255, 255, 255)';
const BLACK = 'rgb(0, 0, 0)';

function chunk(arr, len) {
  let chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

describe('A página deve possuir o título "Paleta de Cores".', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("Existe um elemento `h1` com o id `title` com o título correto", () => {
    cy.get('h1#title').should('contain.text', 'Paleta de Cores');
  })
});

describe('A página deve possuir uma paleta de quatro cores distintas.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("A paleta de cores deve ser um elemento com `id` denominado `color-palette`", () => {
    cy.get('#color-palette')
      .should('be.visible');
  });

  it("Cada cor individual da paleta de cores deve possuir a `classe` `color`.", () => {
    cy.get('.color')
      .should('have.length', 4)
      .then((colors) => {
        for (let i = 0; i < colors.length; i++) {
          cy.wrap(colors[i])
            .should('be.visible');
        }
      });
  });

  it("A cor de fundo de cada elemento da paleta deverá ser a cor que o elemento representa. **A única cor não permitida na paleta é a cor branca.**", () => {
    cy.get('.color')
      .each((color) => {
        cy.wrap(color)
          .should('have.class', 'color')
          .and('not.have.css', 'background-color', WHITE);

        cy.wrap(color)
          .should('have.css', 'background-color');
      });
  });

  it("Cada elemento da paleta de cores deverá ter uma borda preta, sólida e com 1 pixel de largura;", () => {
    cy.get('.color')
      .each((color) => {
        cy.wrap(color)
          .and('have.css', 'border', `1px solid ${BLACK}`)
          .and('have.class', 'color');
      });
  });

  it("A paleta deverá listar todas as cores disponíveis para utilização, lado a lado", () => {
    cy.get('.color')
      .then((colors) => {
        for (let index = 1; index < colors.length; index += 1) {
          const currentColor = colors[index];
          const previousColor = colors[index - 1];

          cy.wrap(currentColor)
            .should('be.onTheRightOf', previousColor)
            .and('be.horizontallyAlignedWith', previousColor);
        }
      });
  });

  it("A paleta de cores deverá ser posicionada abaixo do título 'Paleta de Cores'", () => {
    cy.get('h1#title').then((title) => {
      cy.get('#color-palette').should('be.belowOf', title);
    });
  });

  it("A paleta de cores não deve conter cores repetidas.", () => {
    cy.get('.color').then((colors) => {
      let allColors = Array.from(colors).map((color) => (
        Cypress.$(color).css('background-color')
      ));
      cy.log(allColors);

      let uniqColors = [...new Set(allColors)];
      cy.log(uniqColors);

      expect(allColors.length).to.eq(uniqColors.length);
    });
  });
});

describe('A cor preta deve ser a primeira na paleta de cores.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("A primeira cor da paleta é preta", () => {
    cy.get('.color')
      .first()
      .should('have.css', 'background-color', BLACK);
  });

  it("As demais cores podem ser escolhidas livremente.", () => {
    cy.get('.color')
      .eq(1)
      .should('not.have.css', 'background-color', BLACK);
    cy.get('.color')
      .eq(1)
      .should('not.have.css', 'background-color', WHITE);
    cy.get('.color')
      .eq(1)
      .should('not.have.css', 'background-color', "rgba(0, 0, 0, 0)");
    cy.get('.color')
      .eq(1)
      .should('have.css', 'background-color');

    cy.get('.color')
      .eq(2)
      .should('not.have.css', 'background-color', BLACK);
    cy.get('.color')
      .eq(2)
      .should('not.have.css', 'background-color', WHITE);
    cy.get('.color')
      .eq(2)
      .should('not.have.css', 'background-color', "rgba(0, 0, 0, 0)");
    cy.get('.color')
      .eq(2)
      .should('have.css', 'background-color');

    cy.get('.color')
      .eq(3)
      .should('not.have.css', 'background-color', BLACK);
    cy.get('.color')
      .eq(3)
      .should('not.have.css', 'background-color', WHITE);
    cy.get('.color')
      .eq(3)
      .should('not.have.css', 'background-color', "rgba(0, 0, 0, 0)");
    cy.get('.color')
      .eq(3)
      .should('have.css', 'background-color');
  })
});

describe('A página deve possuir um quadro de pixels, com 25 pixels.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("O quadro de pixels deve possuir o `id` denominado `pixel-board`", () => {
    cy.get('#pixel-board')
      .should('be.visible');
  });

  it("Cada pixel individual dentro do quadro deve possuir a `classe` denominada `pixel`.", () => {
    cy.get('.pixel')
      .should('have.length', 25);
  });

  it("A cor inicial dos pixels dentro do quadro, ao abrir a página, deve ser branca.", () => {
    cy.get('.pixel')
      .should('have.length', 25)
      .each((pixel) => {
        expect(pixel).to.have.css('background-color', WHITE);
      });
  });

  it("O quadro de pixels deve aparecer abaixo da paleta de cores", () => {
    cy.get('#color-palette').then((palette) => {
      cy.get('#pixel-board').should('be.belowOf', palette);
    });
  })
});

describe("Cada elemento do quadro de pixels deve possuir 40 pixels de largura e 40 pixels de altura e ser delimitado por uma borda preta de 1 pixel.", () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("O quadro de pixels tem altura e comprimento de 5 elementos", () => {
    cy.get('.pixel')
      .should('have.length', 25)
      .each((pixel) => {
        expect(pixel).to.have.css('background-color', WHITE);
      })
      .and((pixels) => {
        const rows = chunk(pixels, 5);
        rows.forEach((row) => {
          for (let index = 1; index < row.length; index += 1) {
            const current = pixels[index];
            const previous = pixels[index - 1];

            cy.wrap(current)
              .should('be.onTheRightOf', previous)
              .and('be.horizontallyAlignedWith', previous);
          }
        })

        for (let index = 1; index < 5; index += 1) {
          expect(pixels[index * 5]).to.be.belowOf(pixels[(index - 1) * 5]);
        }
      })
  });

  it('40 pixels deve ser o tamanho total do elemento, incluindo seu conteúdo e excluindo a borda preta, que deve ser criada à parte.', () => {
    cy.get('.pixel')
      .each((pixel) => {
        cy.wrap(pixel)
          .should('have.css', 'height', '40px')
          .and('have.css', 'width', '40px')
          .and('have.css', 'border', `1px solid ${BLACK}`);
      });
  });
});

describe('Ao carregar a página, a cor preta da paleta já deve estar selecionada para pintar os pixels.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("O elemento da cor preta deve possuir, inicialmente, a `classe` `selected`", () => {
    cy.get('.selected').first().should('have.css', 'background-color', BLACK);
  })

  it("Nenhuma outra cor da paleta tem a `classe` `selected`", () => {
    cy.get('.color:not(:first-child)')
      .each((color) => {
        cy.wrap(color)
          .should('not.have.class', 'selected')
      })
  });
});

describe('Ao clicar em uma das cores da paleta, a cor selecionada é que vai ser usada para preencher os pixels no quadro.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("Somente uma cor da paleta de cores tem a classe `selected` de cada vez", () => {
    // click each color
    cy.get('.color').each((selectedColor, selectedColorIndex) => {
      cy.wrap(selectedColor).click();

      // and check that only this color has the class 'selected'
      cy.get('.color').each((color, colorIndex) => {
        if (colorIndex === selectedColorIndex) {
          expect(color).to.have.class('selected');
        } else {
          expect(color).not.to.have.class('selected');
        }
      });
    });
  });

  it('Os pixels dentro do quadro não podem ter a classe `selected` quando são clicados', () => {
    // for each color
    cy.get('.color').each((color) => {
      const backgroundColor = color.css('background-color');
      // click the color
      cy.wrap(color).click();

      // then for each pixel
      cy.get('.pixel').each((pixel) => {
        // click it and check that it has the selected color
        cy.wrap(pixel)
          .click()
          .should('not.have.class', 'selected');
      });
    });
  });
});

describe('Ao clicar em um pixel dentro do quadro após selecionar uma cor na paleta, o pixel deve ser preenchido com esta cor.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("Ao carregar a página deve ser possível pintar os pixels de preto", () => {
    // then for each pixel
    cy.get('.pixel').each((pixel) => {
      // click it and check that it has the selected color
      cy.wrap(pixel)
        .click()
        .should('have.css', 'background-color', BLACK);
    });
  });

  it("Após selecionar uma outra cor na paleta, deve ser possível pintar os pixels com essa cor", () => {
    // for each color
    cy.get('.color').each((color) => {
      const backgroundColor = color.css('background-color');
      // click the color
      cy.wrap(color).click();

      // then for each pixel
      cy.get('.pixel').each((pixel) => {
        // click it and check that it has the selected color
        cy.wrap(pixel)
          .click()
          .should('have.css', 'background-color', backgroundColor);
      });
    });
  });

  it('Somente o pixel que foi clicado deverá ser preenchido com a cor selecionada, sem influenciar na cor dos demais pixels.', () => {
    const colorToPixelIndexMap = { 0: 6, 1: 8, 2: 16, 3: 18 };

    // for each color in the palette
    cy.get('.color').each((color, index) => {
      // first click the color
      cy.wrap(color).click();

      const backgroundColor = color.css('background-color');
      const clickedPixelIndex = colorToPixelIndexMap[index];

      // then we check that, when a pixel is clicked, it shouldn't affect
      cy.get('.pixel').eq(clickedPixelIndex).click();

      // the pixels in the left and right,
      cy.get('.pixel')
        .eq(clickedPixelIndex - 1)
        .should('not.have.css', 'background-color', backgroundColor);
      cy.get('.pixel')
        .eq(clickedPixelIndex + 1)
        .should('not.have.css', 'background-color', backgroundColor);

      // the pixels above and below
      cy.get('.pixel')
        .eq(clickedPixelIndex - 5)
        .should('not.have.css', 'background-color', backgroundColor);
      cy.get('.pixel')
        .eq(clickedPixelIndex + 5)
        .should('not.have.css', 'background-color', backgroundColor);

      // nor the pixels in its diagonal directions
      cy.get('.pixel')
        .eq(clickedPixelIndex - 6)
        .should('not.have.css', 'background-color', backgroundColor);
      cy.get('.pixel')
        .eq(clickedPixelIndex - 4)
        .should('not.have.css', 'background-color', backgroundColor);
      cy.get('.pixel')
        .eq(clickedPixelIndex + 4)
        .should('not.have.css', 'background-color', backgroundColor);
      cy.get('.pixel')
        .eq(clickedPixelIndex + 6)
        .should('not.have.css', 'background-color', backgroundColor);
    });
  });
});

describe('Crie um botão que, ao ser clicado, limpa o quadro preenchendo a cor de todos seus pixels com branco.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it("O botão deve ter o `id` denominado `clear-board`", () => {
    cy.get("#clear-board")
      .should('be.visible');
  });

  it("O botão deve estar posicionado entre a paleta de cores e o quadro de pixels", () => {
    cy.get('#color-palette').then((palette) => {
      cy.get('#clear-board').should('be.belowOf', palette);
    });

    cy.get('#clear-board').then((clearBtn) => {
      cy.get('#pixel-board').should('be.belowOf', clearBtn);
    });
  });

  it("O texto do botão deve ser 'Limpar'", () => {
    cy.get("#clear-board")
      .should('contain.text', 'Limpar');
  });

  it("Ao clicar no botão, o quadro de pixels é totalmente preenchido de branco", () => {
    // select the second color in the palette
    cy.get('.color').eq(1).then((color) => {
      const backgroundColor = color.css('background-color');
      // click the color
      cy.wrap(color).click();

      // then for each pixel
      cy.get('.pixel').each((pixel) => {
        // click it and check that it has the selected color
        cy.wrap(pixel)
          .click()
          .should('have.css', 'background-color', backgroundColor);
      });
    });

    // click the clear board button
    cy.get('#clear-board').click();

    // check that all pixels have white background color
    cy.get('.pixel').each((pixel) => {
      cy.wrap(pixel).should('have.css', 'background-color', WHITE);
    });
  })
});

describe('Faça o quadro de pixels ter seu tamanho definido pelo usuário.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
    // initial board size must be 5
    cy.get('.pixel').should('have.length', 25);
  });

  it("Existe um input com o id `board-size`", () => {
    cy.get("#board-size")
      .should('be.visible');
  });

  it("Existe um botão com o id `generate-board`", () => {
    cy.get("#generate-board")
      .should('be.visible');
  });

  it("O input só deve aceitar número maiores que zero. Essa restrição deve ser feita usando os atributos do elemento `input`", () => {
    cy.get("#board-size[type='number'][min='1']")
  });

  it("O botão deve conter o texto 'VQV'", () => {
    cy.get("#generate-board").contains(/vqv/i);
  });

  it("O input deve estar posicionado entre a paleta de cores e o quadro de pixels", () => {
    cy.get('#color-palette').then((palette) => {
      cy.get('#board-size').should('be.belowOf', palette);
    });

    cy.get('#board-size').then((palette) => {
      cy.get('#pixel-board').should('be.belowOf', palette);
    });
  });

  it("O botão deve estar posicionado ao lado do input", () => {
    cy.get("#board-size").then((board) => {
      cy.get("#generate-board")
        .should('be.onTheRightOf', board)
    })
  });

  it("Se nenhum valor for colocado no input ao clicar no botão, mostre um `alert` com o texto: 'Board inválido!'", () => {
    var alerted = false;
    cy.on('window:alert', msg => alerted = msg);

    cy.get('#generate-board')
      .click()
      .then(() => expect(alerted).to.match(/Board inválido!/i));
  });

  it("Ao clicar no botão com um valor preenchido, o tamanho do board muda.", () => {
    cy.get('#board-size').clear().type(10);
    cy.get('#generate-board').click();
    cy.get('.pixel').should('have.length', 100);
  });

  it("O novo quadro deve ter todos os pixels preenchidos com a cor branca", () => {
    cy.get('#board-size').clear().type(6);
    cy.get('#generate-board').click();
    cy.get('.pixel')
      .should('have.length', 36)
      .each((pixel) => {
        expect(pixel).to.have.css('background-color', WHITE);
      });
  });

});

describe("Limite o tamanho do mínimo e máximo do board.", () => {
  beforeEach(() => {
    cy.visit('./index.html');
    // initial board size must be 5
    cy.get('.pixel').should('have.length', 25);
  });

  it("A altura máxima do board é 50", () => {
    cy.get('#board-size').clear().type(50);
    cy.get('#generate-board').click();
    cy.get('.pixel').should('have.length', 2500);
  });

  it("A altura do board é 5 quando um valor menor é colocado no input", () => {
    // when the board size is less then 5,
    // it should generate a board of size 5
    cy.get('#board-size').clear().type(4);
    cy.get('#generate-board').click();
    cy.get('.pixel').should('have.length', 25);
  });

  it("A altura do board é 50 quando um valor maior é colocado no input", () => {
    // when the board size is greater than 50
    // it should generate a board of size 50
    cy.get('#board-size').clear().type(51);
    cy.get('#generate-board').click();
    cy.get('.pixel').should('have.length', 2500);
  });
})

describe('Faça com que as cores da paleta sejam geradas aleatoriamente ao carregar a página.', () => {
  beforeEach(() => {
    cy.visit('./index.html');
    // initial board size must be 5
    cy.get('.pixel').should('have.length', 25);
  });

  it("As cores geradas na paleta são diferentes a cada carregamento da página", () => {
    cy.get('.color').then((colors) => {
      let currentColors, previousColors;

      // get the palette's initial colors
      previousColors = Array.from(colors).map((color) => (
        Cypress.$(color).css('background-color')
      ));

      // reload the page 5 times and check that the colors change each time
      for (let i = 0; i < 5; i += 1) {
        cy.reload();
        cy.get('.color').then((colors) => {
          currentColors = Array.from(colors).map((color) => (
            Cypress.$(color).css('background-color')
          ));

          expect(currentColors).not.to.deep.equal(previousColors);
          previousColors = currentColors;
        });
      }
    });
  });

  it("A cor preta ainda precisa estar presente e deve ser a primeira na sua paleta de cores", () => {
    cy.get('.color').then((colors) => {
      let currentColors, previousColors;

      // get the palette's initial colors
      previousColors = Array.from(colors).map((color) => (
        Cypress.$(color).css('background-color')
      ));

      expect(previousColors[0]).to.eq(BLACK);

      // reload the page 5 times and check that the colors change each time
      for (let i = 0; i < 5; i += 1) {
        cy.reload();
        cy.get('.color').then((colors) => {
          currentColors = Array.from(colors).map((color) => (
            Cypress.$(color).css('background-color')
          ));

          expect(currentColors[0]).to.eq(BLACK);
          expect(currentColors).not.to.deep.equal(previousColors);
          previousColors = currentColors;
        });
      }
    });
  });
});

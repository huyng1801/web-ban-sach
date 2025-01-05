package com.cdweb.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdweb.springboot.entities.Product;
import com.cdweb.springboot.request.ProductRequest;
import com.cdweb.springboot.response.ProductResponse;
import com.cdweb.springboot.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

	@Autowired
	private ProductService productService;
	
	@GetMapping()
	public ResponseEntity<Page<Product>> findProductByCategory(@RequestParam String category,
			@RequestParam Integer minPrice, @RequestParam Integer maxPrice, @RequestParam String sort,
			@RequestParam Integer page, @RequestParam Integer limit) {
		Page<Product> respo = productService.getListProductByCategory(category, minPrice, maxPrice, sort, page, limit);
		System.out.println(" Find product By Category Successfully");
		
		return new ResponseEntity<>(respo, HttpStatus.ACCEPTED);
	}
	
//	@GetMapping("/getProductById")
//	public Product findById(@RequestParam Long productId) throws ProductException {
//		return productService.getProductById(productId);
//	}
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable("id") Long id) {
        return productService.getProductById(id);
    }
    @GetMapping("/name")
    public ResponseEntity<Page<Product>> getProductByName(@RequestParam("productName") String productName,
    		@RequestParam Integer minPrice, @RequestParam Integer maxPrice, @RequestParam String sort,
			@RequestParam Integer page, @RequestParam Integer limit) {
		Page<Product> respo = productService.getListProductByProductName(productName, minPrice, maxPrice, sort, page, limit);
        return new ResponseEntity<>(respo, HttpStatus.ACCEPTED);
    }
    @GetMapping("/suggest/{suggest}")
    public List<String> getProductNameSuggest(@PathVariable("suggest") String suggest) {
        return productService.getProductNameSuggest(suggest);
    }
	  @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest productRequest) {
        ProductResponse createdProduct = productService.createProduct(productRequest);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable("id") Long productId, 
                                                         @RequestBody ProductRequest productRequest) {
        ProductResponse updatedProduct = productService.updateProduct(productId, productRequest);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }


	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable("id") Long productId) {
		boolean isDeleted = productService.deleteProduct(productId);
		if (isDeleted) {
			return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
		}
	}

}


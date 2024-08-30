package category;

import com.quizzical.quizzical.category.Category;
import com.quizzical.quizzical.category.CategoryRepository;
import com.quizzical.quizzical.category.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @InjectMocks
    private CategoryService categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    private Category category1;
    private Category category2;
    private Category category3;

    @BeforeEach
    public void setUp() {
        // Create and configure Category objects
        category1 = new Category();
        category1.setId(1L);
        category1.setName("Programming");

        category2 = new Category();
        category2.setId(2L);
        category2.setName("Mathematics");

        category3 = new Category();
        category3.setId(3L);
        category3.setName("Science");
    }

    @Test
    public void testGetCategoryById() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category1));

        Category category = categoryService.getCategoryById(1L);
        assertNotNull(category);
        assertEquals(category1.getId(), category.getId());
        assertEquals(category1.getName(), category.getName());
    }

    @Test
    public void testGetCategoryByIdNotFound() {
        Long id = 999999L;
        when(categoryRepository.findById(id)).thenReturn(Optional.empty());

        Category category = categoryService.getCategoryById(id);
        assertNull(category);
    }

    @Test
    public void testGetAllCategories() {
        List<Category> categories = List.of(category1, category2, category3);
        when(categoryRepository.findAll()).thenReturn(categories);

        List<Category> result = categoryService.getAllCategories();

        assertNotNull(result);
        assertEquals(categories.size(), result.size());
        assertEquals(categories, result);
    }

    @Test
    public void testSaveCategory() {
        when(categoryRepository.save(category1)).thenReturn(category1);

        Category savedCategory = categoryService.saveCategory(category1);

        assertNotNull(savedCategory);
        assertEquals(category1.getId(), savedCategory.getId());
        assertEquals(category1.getName(), savedCategory.getName());
    }

    @Test
    public void testDeleteCategory() {
        Long id = 1L;
        doNothing().when(categoryRepository).deleteById(id);

        categoryService.deleteCategory(id);

        verify(categoryRepository, times(1)).deleteById(id);
    }
}

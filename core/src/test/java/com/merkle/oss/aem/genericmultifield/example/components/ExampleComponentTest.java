package com.merkle.oss.aem.genericmultifield.example.components;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the {@link ExampleComponent} class.
 */
@ExtendWith(AemContextExtension.class)
class ExampleComponentTest {

    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() {
        context.addModelsForPackage("com.merkle.oss.aem.genericmultifield.example.components");
        context.load().json("/contextmocks/ExampleComponentTest.json", "/content");
    }

    /**
     * <p>Method under test: {@link ExampleComponent#getTitle()}
     */
    @Test
    void testGetTitle() {
        final Resource resource = context.resourceResolver().getResource("/content/component-with-items");
        final ExampleComponent model = resource.adaptTo(ExampleComponent.class);

        assertNotNull(model);
        assertEquals("My Component Title", model.getTitle());
    }

    /**
     * <p>Method under test: {@link ExampleComponent#getItems()}
     */
    @Test
    void testGetItems_FiltersInvalid() {
        final Resource resource = context.resourceResolver().getResource("/content/component-with-items");
        final ExampleComponent model = resource.adaptTo(ExampleComponent.class);

        assertNotNull(model);

        assertEquals(2, model.getItems().size());
        assertEquals("Title 1", model.getItems().getFirst().getItemTitle());
    }

    /**
     * <p>Method under test: {@link ExampleComponent#isViewable()}
     */
    @Test
    void testIsViewable_WithItems() {
        final Resource resource = context.resourceResolver().getResource("/content/component-with-items");
        final ExampleComponent model = resource.adaptTo(ExampleComponent.class);

        assertTrue(model.isViewable());
    }

    /**
     * <p>Method under test: {@link ExampleComponent#isViewable()}
     */
    @Test
    void testIsViewable_Empty() {
        final Resource resource = context.resourceResolver().getResource("/content/empty-component");
        final ExampleComponent model = resource.adaptTo(ExampleComponent.class);

        assertNotNull(model);
        assertFalse(model.isViewable());
        assertTrue(model.getItems().isEmpty());
    }

}

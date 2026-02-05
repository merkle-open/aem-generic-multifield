package com.merkle.oss.aem.genericmultifield.example.components;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the {@link ExampleComponentItem} class.
 */
@ExtendWith(AemContextExtension.class)
class ExampleComponentItemTest {

    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() {
        context.addModelsForPackage("com.merkle.oss.aem.genericmultifield.example.components");
        context.load().json("/contextmocks/ExampleComponentItemTest.json", "/content");
    }

    /**
     * Method under test: {@link ExampleComponentItem#getItemTitle()}, {@link ExampleComponentItem#getItemText()},
     * {@link ExampleComponentItem#getItemPath()}, {@link ExampleComponentItem#getText()} and {@link ExampleComponentItem#getImage()}
     */
    @Test
    void testValidItem() {
        Resource resource = context.resourceResolver().getResource("/content/valid-item");
        ExampleComponentItem model = resource.adaptTo(ExampleComponentItem.class);

        assertNotNull(model);
        assertEquals("Item Title", model.getItemTitle());
        assertEquals("Item Text", model.getItemText());
        assertEquals("/content/page", model.getItemPath());
        assertEquals("Additional Text", model.getText());

        assertNotNull(model.getImage());
        assertEquals("/content/dam/test.jpg", model.getImage().getSrc());
        assertTrue(model.isValid());
    }

    /**
     * Method under test: {@link ExampleComponentItem#isValid()}
     */
    @Test
    void testInvalidItems() {
        Resource missingTextRes = context.resourceResolver().getResource("/content/invalid-item-missing-text");
        ExampleComponentItem missingTextModel = missingTextRes.adaptTo(ExampleComponentItem.class);
        assertNotNull(missingTextModel);
        assertFalse(missingTextModel.isValid());

        Resource missingTitleRes = context.resourceResolver().getResource("/content/invalid-item-missing-title");
        ExampleComponentItem missingTitleModel = missingTitleRes.adaptTo(ExampleComponentItem.class);
        assertNotNull(missingTitleModel);
        assertFalse(missingTitleModel.isValid());
    }

}

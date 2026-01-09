package com.merkle.oss.aem.genericmultifield.example.components;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the {@link ExampleImage} class.
 */
@ExtendWith(AemContextExtension.class)
class ExampleImageTest {

    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() {
        context.addModelsForPackage("com.merkle.oss.aem.genericmultifield.example.components");
        context.load().json("/contextmocks/ExampleImageTest.json", "/content");
    }

    /**
     * <p>Method under test: {@link ExampleImage#getTitle()}, {@link ExampleImage#getAlt()}, {@link ExampleImage#getSrc()} and {@link ExampleImage#isValid()}
     */
    @Test
    void testValidImage() {
        final Resource resource = context.resourceResolver().getResource("/content/valid-image");
        final ExampleImage model = resource.adaptTo(ExampleImage.class);

        assertNotNull(model);
        assertEquals("Image Title", model.getTitle());
        assertEquals("Image Alt Text", model.getAlt());
        assertEquals("/content/dam/example.jpg", model.getSrc());
        assertTrue(model.isValid());
    }

    /**
     * <p>Method under test: {@link ExampleImage#getAlt()}
     */
    @Test
    void testDecorativeImage() {
        final Resource resource = context.resourceResolver().getResource("/content/decorative-image");
        final ExampleImage model = resource.adaptTo(ExampleImage.class);

        assertNotNull(model);
        assertEquals("", model.getAlt());
        assertTrue(model.isValid());
    }

    /**
     * <p>Method under test: {@link ExampleImage#isValid()}
     */
    @Test
    void testInvalidImage() {
        final Resource resource = context.resourceResolver().getResource("/content/invalid-image");
        final ExampleImage model = resource.adaptTo(ExampleImage.class);

        assertNotNull(model);
        assertFalse(model.isValid(), "Image should be invalid without fileReference");
    }

}

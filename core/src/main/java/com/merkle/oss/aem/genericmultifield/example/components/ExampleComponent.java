package com.merkle.oss.aem.genericmultifield.example.components;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

import java.util.Collections;
import java.util.List;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ExampleComponent {

    @ValueMapValue
    private @Nullable String title;

    @ChildResource
    private @NonNull List<ExampleComponentItem> items = Collections.emptyList();

    public @Nullable String getTitle() {
        return title;
    }

    public @NonNull List<ExampleComponentItem> getItems() {
        return items.stream()
                .filter(ExampleComponentItem::isValid)
                .toList();
    }

    public boolean isViewable() {
        return CollectionUtils.isNotEmpty(getItems());
    }

}

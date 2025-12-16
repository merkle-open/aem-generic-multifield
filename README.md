# Generic Multifield for AEMaaCS

With this project you can use a widget
in [AEM as a Cloud Service](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/release-notes/home.html)
Touch UI which lets you create a generic multifield in a dialog.

## Status

<p align="center">
    <a href="https://maven-badges.sml.io/sonatype-central/com.merkle.oss.aem/aem-generic-multifield/" style="text-decoration: none;">
        <img alt="Sonatype Central Version" src="https://img.shields.io/maven-central/v/com.merkle.oss.aem/aem-generic-multifield?strategy=highestVersion&logo=sonatype&logoColor=white&logoSize=auto&label=Sonatype-Central&labelColor=black&color=blue&link=https%3A%2F%2Fmaven-badges.sml.io%2Fsonatype-central%2Fcom.merkle.oss.aem%2Faem-generic-multifield%2F"></a>
    <a href="https://github.com/merkle-open/aem-generic-multifield/actions/workflows/verify-snapshot.yml" style="text-decoration: none;">
        <img alt="CI - Github Action" src="https://img.shields.io/github/actions/workflow/status/merkle-open/aem-generic-multifield/verify-snapshot.yml?branch=develop&logo=githubactions&logoColor=white&logoSize=auto&label=CI&labelColor=black&link=https%3A%2F%2Fgithub.com%2Fmerkle-open%2Faem-generic-multifield%2Factions%2Fworkflows%2Fverify-snapshot.yml"></a>
    <a href="https://github.com/merkle-open/aem-generic-multifield/actions/workflows/deploy-snapshot.yml" style="text-decoration: none;">
        <img alt="Deploy SNAPSHOT - Github Action" src="https://img.shields.io/github/actions/workflow/status/merkle-open/aem-generic-multifield/deploy-snapshot.yml?branch=develop&logo=githubactions&logoColor=white&logoSize=auto&label=SNAPSHOT-Deploy&labelColor=black&link=https%3A%2F%2Fgithub.com%2Fmerkle-open%2Faem-generic-multifield%2Factions%2Fworkflows%2Fdeploy-snapshot.yml"></a>
</p>

## Requirements

| System                 |
|------------------------|
| [AEM as a Cloud Service](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/release-notes/home.html) |

## Maven Dependency

```
  <dependency>
    <groupId>com.merkle.oss.aem</groupId>
    <artifactId>genericmultifield</artifactId>
    <version>4.0.1-SNAPSHOT</version>
  </dependency>
```

## in AEM

Since the Generic Multifield is built as an OSGi bundle, only the bundle has to be installed into your AEM instance.
With the common AEM archetype it can be added within the embedded configuration of the `content-package-maven-plugin`
plugin.

```xml
<plugin>
    <groupId>com.day.jcr.vault</groupId>
    <artifactId>content-package-maven-plugin</artifactId>
    <extensions>true</extensions>
    <configuration>
        ...
        <embeddeds>
            <embedded>
                <groupId>com.merkle.oss.aem</groupId>
                <artifactId>genericmultifield</artifactId>
                <target>/apps/project-name/install</target>
            </embedded>
        </embeddeds>
    </configuration>
</plugin>
```

### Component Dialog

Example usage of the Generic Multifield in your component `_cq_dialog.xml` definition within AEM:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root>
    <!-- Within the component dialog definition -->
    ...
    <title
            jcr:primaryType="nt:unstructured"
            sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
            fieldLabel="Title"
            name="./title"/>
    <genericmultifield
            jcr:primaryType="nt:unstructured"
            sling:resourceType="merkle/genericmultifield"
            itemDialog="/your/project/path/component/item-dialog.xml"
            fieldLabel="Generic Multifield"
            fieldDescription="A list of generic multfield items"
            itemNameProperty="itemTitle"
            minElements="2"
            maxElements="5"
            required="{Boolean}true"
            allowItemCopy="{Boolean}true"
            itemStorageNode="./items"/>
    ...
</jcr:root>
```

#### Properties

| Property             | Function                                                                                                                                          |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| **itemDialog**       | Path reference to the dialog definition of a generic multifield item.                                                                             |
| **itemNameProperty** | Defines the value representation of a generic multifield entry within the component dialog. Must be a reference to an item dialog property.       |
| **minElements**      | Defines the minimal amount of generic multifield entries.                                                                                         |
| **maxElements**      | Defines the maximal amount of generic multifield entries.                                                                                         |
| **required**         | If set to `{Boolean}true`, the main component dialog will not validate until at least one item hast been defined.                                 |
| **allowItemCopy**    | If set to `{Boolean}true`, defined multifield entries may be copied to the list.                                                                  |
| **itemStorageNode**  | Defines the parent node name created within the component node. Generic multifield items will be saved beneath this node <br/>(default: `items`). |

![main dialog](docs/component.png)

### Item Dialog

Example definition of the Generic Multifield item in your component's `item-dialog.xml` referenced
within `<genericmultifield>` definition via property `itemDialog`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          jcr:primaryType="nt:unstructured"
          sling:resourceType="cq/gui/components/authoring/dialog"
          jcr:title="Generic Multifield Item">
    <content
            jcr:primaryType="nt:unstructured"
            sling:resourceType="granite/ui/components/coral/foundation/tabs">
        <items
                jcr:primaryType="nt:unstructured">
            <tabOne
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns"
                    jcr:title="Tab 1"
                    margin="{Boolean}true">
                <items
                        jcr:primaryType="nt:unstructured">
                    <column
                            jcr:primaryType="nt:unstructured"
                            sling:resourceType="granite/ui/components/coral/foundation/container">
                        <items
                                jcr:primaryType="nt:unstructured">
                            <itemTitle
                                    jcr:primaryType="nt:unstructured"
                                    sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                                    fieldLabel="Item Title"
                                    fieldDescription="Item Title Description"
                                    required="{Boolean}true"
                                    name="./itemTitle"/>
                            <itemText
                                    jcr:primaryType="nt:unstructured"
                                    sling:resourceType="granite/ui/components/coral/foundation/form/textarea"
                                    fieldLabel="Item Text"
                                    fieldDescription="Item Text Description"
                                    name="./itemText"/>
                            <itemPath
                                    jcr:primaryType="nt:unstructured"
                                    sling:resourceType="granite/ui/components/coral/foundation/form/pathbrowser"
                                    fieldLabel="Item Path"
                                    fieldDescription="Item Path Description"
                                    name="./itemPath"/>
                        </items>
                    </column>
                </items>
            </tabOne>
            <tabTwo
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns"
                    jcr:title="Tab 2"
                    margin="{Boolean}true">
                <items
                        jcr:primaryType="nt:unstructured">
                    <column
                            jcr:primaryType="nt:unstructured"
                            sling:resourceType="granite/ui/components/coral/foundation/container">
                        <items
                                jcr:primaryType="nt:unstructured">

                            <!-- properties definition -->

                        </items>
                    </column>
                </items>
            </tabTwo>
            <tabThree
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns"
                    jcr:title="Tab 3"
                    margin="{Boolean}true">
                <items
                        jcr:primaryType="nt:unstructured">
                    <column
                            jcr:primaryType="nt:unstructured"
                            sling:resourceType="granite/ui/components/coral/foundation/container">
                        <items
                                jcr:primaryType="nt:unstructured">

                            <!-- properties definition -->

                        </items>
                    </column>
                </items>
            </tabThree>
        </items>
    </content>
</jcr:root>
``` 

![multifield dialog](docs/item.png)

### Repository

In the repository the content is stored as follows:

![content](docs/repo.png)

## Development

Build locally with Maven

```
    mvn clean install -PautoInstallBundle
```

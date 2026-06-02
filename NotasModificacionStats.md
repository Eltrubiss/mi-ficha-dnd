| Tipo                               | Uso principal                  | Campos clave                                                | Estado                                 |
| ---------------------------------- | ------------------------------ | ----------------------------------------------------------- | -------------------------------------- |
| `bono_stat`                      | Sumar a característica        | `statAfectada`, `valor`                                 | Integrado                              |
| `bono_habilidad` sin condición  | Competencia en habilidad       | `habilidadAfectada`                                       | Integrado como competencia             |
| `bono_habilidad` con condición  | Bono numérico a habilidad     | `habilidadAfectada`, `valor`, `condicion.competencia` | Integrado                              |
| `competencia`, `mitad_competencia`, `doble_competencia`                    | Competencia en habilidad       | `habilidadAfectada`                                       | Integrado como competencia             |
| `bono_salvacion`                 | Bono a salvación              | `statAfectada` / `salvacionAfectada`, `valor`         | Integrado                              |
| `bonoCA` / `bonifCA`           | Bono directo a CA              | `valor`, `condicion`                                    | Integrado                              |
| `caSinArmadura`                  | Fórmula alternativa de CA     | `base`, `modificadores`, `condicion`                  | Integrado                              |
| `velocidad` / `bono_velocidad` | Bono a velocidad               | `valor`, `condicion`                                    | Integrado                              |
| `vision`                         | Visión/sentidos               | `tipoVision`, `alcance`                                 | Datos presentes, integración limitada |
| `bono_arma`                      | Arma concreta/competencia arma | `armaAfectada`, `valor`                                 | Datos presentes, integración limitada |
| `bono_ataque`                    | Bono a ataques                 | `valor`, `condicion.etiqueta`                           | Datos presentes, integración limitada |
| `bono_prueba_stat` | suma bonos a habilidades según su stat asociada | `condicion.competencia` | Integrado |


import React, { useState, useEffect } from "react";
import qs from "qs"
import { Button, Card, Form, Templates, Wrapper } from "./styles";

export function Home() {
   const [templates, setTemplates] = useState([]);
   // Identificar e salvar o template que o usuario selecionou
   const [selectedTemplate, setSelectedTemplate] = useState(null);

   const [boxes, setBoxes] = useState([])

   const [generatedMeme, setGeneratedMeme] = useState(null)

   // Pegar os dados da API
   useEffect(() => {
      // Function Async autoexec
      (async () => {
         const resp = await fetch("https://api.imgflip.com/get_memes");
         // Ja desestrurar memes
         const { data: { memes } } = await resp.json()
         setTemplates(memes);
      })();
   }, [])

   // Currying -> retorna outra funcao
   const handleInputChange = (index) => (e) => {
      const newValues = boxes;
      newValues[index] = e.target.value;
      setBoxes(newValues)
   }

   function handleSelectTemplate(template) {
      setSelectedTemplate(template);
      setBoxes([]);
   }

   async function handleSubmit(e) {
      e.preventDefault();
      console.log(boxes)

      const params = qs.stringify({
         template_id: selectedTemplate.id,
         username: "pedroVictor90123",
         password: "olamundo1234",
         boxes: boxes.map(text => ({ text })),
      })
      const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`);
      const { data: { url } } = await resp.json();
      setGeneratedMeme(url)
   }

   function handleReset () {
      setSelectedTemplate(null);
      setBoxes([])
      setGeneratedMeme(null)
   }

   return (
      <Wrapper>
         <h1>MemeMaker</h1>

         <Card>
            {
               generatedMeme && (
                  <>
                     <img src={generatedMeme} alt="Genereta Meme"/>
                     <Button type="button" onClick={handleReset}>Criar outro meme</Button>
                  </>
               )
            }
            {!generatedMeme && (
               <>
                  <h2>Selecione um template</h2>
                  <Templates>
                     {
                        templates.map((template) => (
                           <button
                              key={template.id}
                              type="button"
                              onClick={() => handleSelectTemplate(template)}
                              className={template.id === selectedTemplate?.id ? "selected" : ""}
                           >
                              <img src={template.url} about={template.name} />
                           </button>
                        ))
                     }
                  </Templates>

                  {
                     selectedTemplate && (
                        <>
                           <h2>Textos</h2>
                           <Form onSubmit={handleSubmit}>
                              {(new Array(selectedTemplate.box_count)).fill("").map((_, index) => (
                                 <input key={String(Math.random())}
                                    placeholder={`Text #${index + 1}`}
                                    onChange={handleInputChange(index)}
                                 />
                              ))}
                              <Button>MakeMyMeme</Button>
                           </Form>
                        </>
                     )
                  }
               </>
            )}
         </Card>
      </Wrapper>
   )
}

// https://api.imgflip.com/get_memes
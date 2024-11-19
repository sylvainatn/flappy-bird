import React, { useState, useEffect, useRef } from "react";

function FlappyBird() {

   const [birdPosition, setBirdPosition] = useState(200);
   const [isGameRunning, setIsGameRunning] = useState(true);
   const [pipePosition, setPipePosition] = useState(400);
   const [pipeHeight, setPipeHeight] = useState(Math.floor(Math.random() * 200) + 50);
   const [score, setScore] = useState(0);

   const gameAreaHeight = 500;
   const birdSize = 20;
   const pipeWidth = 80;
   const pipeGap = 150;
   const gravity = 3;
   const jumpHeight = -10;

   const birdVelocity = useRef(0);

   // Gestion du saut de l'oiseau
   const handleJump = () => {
      if (isGameRunning) birdVelocity.current = jumpHeight;
   };

   // Gestion de l'écouteur pour la flèche du haut
   useEffect(() => {
      const handleKeyDown = (e) => {
         if (e.key === "ArrowUp") {
            handleJump();
         }
      };

      document.addEventListener("keydown", handleKeyDown);

      // Nettoyage de l'écouteur lors du démontage du composant
      return () => {
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, [isGameRunning]);

   // Effet pour la gravité et la position de l'oiseau
   useEffect(() => {
      const gameLoop = setInterval(() => {
         if (!isGameRunning) return;

         setBirdPosition((prev) => {
            const newPosition = prev + birdVelocity.current;
            birdVelocity.current += gravity * 0.2; // Simule la gravité
            return Math.min(newPosition, gameAreaHeight - birdSize); // Empêche de dépasser le bas
         });
      }, 25);

      return () => clearInterval(gameLoop);
   }, [isGameRunning]);

   // Effet pour déplacer les tuyaux
   useEffect(() => {
      const pipeInterval = setInterval(() => {
         if (!isGameRunning) return;

         setPipePosition((prev) => {
            if (prev <= -pipeWidth) {
               setScore((prevScore) => prevScore + 1);
               setPipeHeight(Math.floor(Math.random() * 200)); // Nouveaux tuyaux
               return 400; // Réinitialise la position des tuyaux
            } else {
               return prev - 5; // Avance les tuyaux
            }
         });
      }, 30);

      return () => clearInterval(pipeInterval);
   }, [isGameRunning]);

   // Vérification de collision
   useEffect(() => {
      const birdTop = birdPosition;
      const birdBottom = birdPosition + birdSize;
      const pipeTop = pipeHeight;
      const pipeBottom = pipeHeight + pipeGap;

      if (
         pipePosition <= birdSize && pipePosition + pipeWidth >= 0 &&
         (birdTop < pipeTop || birdBottom > pipeBottom) ||
         birdBottom >= gameAreaHeight
      ) {
         setIsGameRunning(false); // Arrête le jeu en cas de collision
      }
   }, [birdPosition, pipePosition, pipeHeight]);

   // Redémarrage du jeu
   const restartGame = () => {
      setBirdPosition(200);
      setPipePosition(400);
      setPipeHeight(Math.floor(Math.random() * 200) + 50);
      setIsGameRunning(true);
      setScore(0);
      birdVelocity.current = 0;
   };

   return (
      <div style={{ textAlign: "center" }}>
         <h1>Flappy Bird Simplifié</h1>
         <p>Score: {score}</p>
         <div
            onClick={handleJump}
            style={{
               position: "relative",
               width: "400px",
               height: `${gameAreaHeight}px`,
               background: `url("../img/fond.jpg") no-repeat center center`,

               overflow: "hidden",
               margin: "0 auto",
               border: "2px solid #333"
            }}
         >
            {/* Oiseau */}
            <div
               style={{
                  position: "absolute",
                  top: `${birdPosition}px`,
                  left: "50px",
                  width: `${birdSize}px`,
                  height: `${birdSize}px`,
                  backgroundColor: "yellow",
                  borderRadius: "50%"
               }}
            ></div>

            {/* Tuyau du haut */}
            <div
               style={{
                  position: "absolute",
                  top: "0",
                  left: `${pipePosition}px`,
                  width: `${pipeWidth}px`,
                  height: `${pipeHeight}px`,
                  backgroundColor: "green"
               }}
            ></div>

            {/* Tuyau du bas */}
            <div
               style={{
                  position: "absolute",
                  top: `${pipeHeight + pipeGap}px`,
                  left: `${pipePosition}px`,
                  width: `${pipeWidth}px`,
                  height: `${gameAreaHeight - (pipeHeight + pipeGap)}px`,
                  backgroundColor: "green"
               }}
            ></div>

            {!isGameRunning && (
               <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  color: "red",
                  fontSize: "24px"
               }}>
                  <p>Game Over</p>
                  <button onClick={restartGame}>Recommencer</button>
               </div>
            )}
         </div>
      </div>
   );
}

export default FlappyBird;

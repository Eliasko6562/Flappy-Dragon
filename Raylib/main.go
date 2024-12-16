//3d game coded in go using raylib


package main

import rl "github.com/gen2brain/raylib-go/raylib"

func main() {
	rl.InitWindow(800, 450, "Skibidee raylibee")
	defer rl.CloseWindow()

	rl.SetTargetFPS(60)

	for !rl.WindowShouldClose() {
		rl.BeginDrawing()

		rl.ClearBackground(rl.RayWhite)
		rl.DrawGrid(10, 1.0)
		rl.DrawFPS(10, 10)

		rl.EndDrawing()
	}
}